export async function handler(event) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  try {
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    if (!N8N_WEBHOOK_URL) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing env var: N8N_WEBHOOK_URL" }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const content = String(body.content || "").trim();

    if (!content) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "content is required" }),
      };
    }

    const r = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!r.ok) {
      return {
        statusCode: r.status,
        headers: corsHeaders,
        body: JSON.stringify({ error: "n8n error", details: data }),
      };
    }

    if (!data || !Array.isArray(data.slides)) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid response shape from n8n", details: data }),
      };
    }

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(data) };
  } catch (e) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Server error", details: String(e?.message || e) }),
    };
  }
}
