const { app } = require('@azure/functions');
const { TableClient } = require('@azure/data-tables');

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

const TABLES = {
  overrides: 'csiOverrides',
  brain: 'csiBrain',
  profiles: 'csiProfiles',
  releases: 'csiReleases',
  help: 'csiHelp',
  paths: 'csiPaths',
  changelog: 'csiChangelog',
  favorites: 'csiFavorites',
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

function getTable(name) {
  return TableClient.fromConnectionString(CONNECTION_STRING, name);
}

async function ensureTables() {
  for (const name of Object.values(TABLES)) {
    try {
      await getTable(name).createTable();
    } catch (e) { /* already exists */ }
  }
}

app.http('sync', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const headers = corsHeaders();

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return { status: 200, headers, body: '' };
    }

    try {
      await ensureTables();

      // GET - load all data
      if (request.method === 'GET') {
        const action = new URL(request.url).searchParams.get('action');

        if (action === 'getall') {
          const result = {};
          for (const [key, tableName] of Object.entries(TABLES)) {
            result[key] = [];
            try {
              const client = getTable(tableName);
              for await (const entity of client.listEntities()) {
                const row = {};
                for (const [k, v] of Object.entries(entity)) {
                  if (k.startsWith('_') || ['partitionKey','rowKey','timestamp','etag'].includes(k)) continue;
                  try { row[k] = JSON.parse(v); } catch { row[k] = v; }
                }
                row.id = entity.rowKey;
                result[key].push(row);
              }
            } catch (e) { /* empty table */ }
          }
          return { status: 200, headers, body: JSON.stringify(result) };
        }

        return { status: 200, headers, body: JSON.stringify({ status: 'ok' }) };
      }

      // POST - write data or AI
      if (request.method === 'POST') {
        const body = await request.json();
        const action = body.action;

        // AI: parse release note
        if (action === 'parseRelease' || action === 'draftArticle') {
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': ANTHROPIC_KEY,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-6',
              max_tokens: action === 'parseRelease' ? 1500 : 1000,
              messages: [{ role: 'user', content: body.prompt }],
            }),
          });
          const data = await response.json();
          return { status: 200, headers, body: JSON.stringify(data) };
        }

        // Sync: save entity
        const tableMap = {
          override: TABLES.overrides,
          brain: TABLES.brain,
          profile: TABLES.profiles,
          release: TABLES.releases,
          help: TABLES.help,
          path: TABLES.paths,
          changelog: TABLES.changelog,
          favorite: TABLES.favorites,
        };

        const tableName = tableMap[action];
        if (!tableName) {
          return { status: 400, headers, body: JSON.stringify({ error: 'Unknown action: ' + action }) };
        }

        const client = getTable(tableName);
        const id = body.id || (body.sheet + '|' + body.feature + '|' + body.platform) || Date.now().toString();

        const entity = { partitionKey: action, rowKey: id };
        for (const [k, v] of Object.entries(body)) {
          if (k === 'action' || k === 'id') continue;
          entity[k] = typeof v === 'object' ? JSON.stringify(v) : String(v ?? '');
        }

        await client.upsertEntity(entity, 'Replace');
        return { status: 200, headers, body: JSON.stringify({ ok: true, id }) };
      }

      return { status: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    } catch (err) {
      context.error('ACG CSI Function error:', err);
      return { status: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }
});
