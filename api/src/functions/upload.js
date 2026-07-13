const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = 'csi-uploads';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

app.http('upload', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const headers = corsHeaders();

    if (request.method === 'OPTIONS') {
      return { status: 200, headers, body: '' };
    }

    try {
      const body = await request.json();
      const base64Data = body.data; // base64 string
      const fileType = body.type || 'image/png';
      const fileName = body.name || ('upload-' + Date.now() + '.png');

      if (!base64Data) {
        return { status: 400, headers, body: JSON.stringify({ error: 'No data provided' }) };
      }

      // Convert base64 to buffer
      const base64 = base64Data.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');

      // Upload to Azure Blob Storage
      const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
      const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

      // Create container if it doesn't exist (public read access)
      await containerClient.createIfNotExists({ access: 'blob' });

      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.upload(buffer, buffer.length, {
        blobHTTPHeaders: { blobContentType: fileType }
      });

      const url = blockBlobClient.url;
      return { status: 200, headers, body: JSON.stringify({ ok: true, url }) };

    } catch (err) {
      context.error('Upload error:', err);
      return { status: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }
});
