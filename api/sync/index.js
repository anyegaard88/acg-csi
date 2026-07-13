// ACG Client Software Intelligence — Azure Function: /api/sync
// Handles all data sync operations (replaces Google Apps Script)
// Storage: Azure Table Storage
// AI: Anthropic API (key stored in Azure env vars)

const { TableClient } = require("@azure/data-tables");

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// Table names
const TABLES = {
  overrides:  "csiOverrides",
  brain:      "csiBrain",
  profiles:   "csiProfiles",
  releases:   "csiReleases",
  help:       "csiHelp",
  paths:      "csiPaths",
  changelog:  "csiChangelog",
  favorites:  "csiFavorites",
};

// ── CORS helper ──────────────────────────────────────────────────────────────
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

// ── Get or create table client ────────────────────────────────────────────────
function getTable(name) {
  return TableClient.fromConnectionString(CONNECTION_STRING, name);
}

// ── Create tables if they don't exist ────────────────────────────────────────
async function ensureTables() {
  for (const name of Object.values(TABLES)) {
    try {
      const client = getTable(name);
      await client.createTable();
    } catch (e) {
      // Table already exists — fine
    }
  }
}

// ── Main handler ─────────────────────────────────────────────────────────────
module.exports = async function (context, req) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    context.res = { status: 200, headers: corsHeaders(), body: "" };
    return;
  }

  try {
    await ensureTables();

    // ── GET: load all data ────────────────────────────────────────────────────
    if (req.method === "GET") {
      const action = req.query.action;

      if (action === "getall") {
        const result = {};
        for (const [key, tableName] of Object.entries(TABLES)) {
          result[key] = [];
          try {
            const client = getTable(tableName);
            const entities = client.listEntities();
            for await (const entity of entities) {
              // Parse JSON fields
              const row = {};
              for (const [k, v] of Object.entries(entity)) {
                if (k.startsWith("_") || k === "partitionKey" || k === "rowKey" || k === "timestamp" || k === "etag") continue;
                try { row[k] = JSON.parse(v); } catch { row[k] = v; }
              }
              row.id = entity.rowKey;
              result[key].push(row);
            }
          } catch (e) { /* empty table is fine */ }
        }
        context.res = { status: 200, headers: corsHeaders(), body: JSON.stringify(result) };
        return;
      }

      context.res = { status: 200, headers: corsHeaders(), body: JSON.stringify({ status: "ok" }) };
      return;
    }

    // ── POST: write data or call AI ───────────────────────────────────────────
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const action = body.action;

      // ── AI: parse release note ──────────────────────────────────────────────
      if (action === "parseRelease") {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1500,
            messages: [{ role: "user", content: body.prompt }],
          }),
        });
        const data = await response.json();
        context.res = { status: 200, headers: corsHeaders(), body: JSON.stringify(data) };
        return;
      }

      // ── AI: draft article from brain capture ────────────────────────────────
      if (action === "draftArticle") {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            messages: [{ role: "user", content: body.prompt }],
          }),
        });
        const data = await response.json();
        context.res = { status: 200, headers: corsHeaders(), body: JSON.stringify(data) };
        return;
      }

      // ── Sync: save entity ───────────────────────────────────────────────────
      const tableMap = {
        override:  TABLES.overrides,
        brain:     TABLES.brain,
        profile:   TABLES.profiles,
        release:   TABLES.releases,
        help:      TABLES.help,
        path:      TABLES.paths,
        changelog: TABLES.changelog,
        favorite:  TABLES.favorites,
      };

      const tableName = tableMap[action];
      if (!tableName) {
        context.res = { status: 400, headers: corsHeaders(), body: JSON.stringify({ error: "Unknown action: " + action }) };
        return;
      }

      const client = getTable(tableName);
      const id = body.id || (body.sheet + "|" + body.feature + "|" + body.platform) || Date.now().toString();

      // Serialize all fields to strings for Table Storage
      const entity = {
        partitionKey: action,
        rowKey: id,
      };
      for (const [k, v] of Object.entries(body)) {
        if (k === "action" || k === "id") continue;
        entity[k] = typeof v === "object" ? JSON.stringify(v) : String(v ?? "");
      }

      await client.upsertEntity(entity, "Replace");
      context.res = { status: 200, headers: corsHeaders(), body: JSON.stringify({ ok: true, id }) };
      return;
    }

    context.res = { status: 405, headers: corsHeaders(), body: JSON.stringify({ error: "Method not allowed" }) };

  } catch (err) {
    context.log.error("ACG CSI Function error:", err);
    context.res = {
      status: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err.message }),
    };
  }
};
