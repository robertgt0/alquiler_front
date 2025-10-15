cat > notify.ts << 'EOF'
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const backendUrl = process.env.NOTIF_BACKEND_URL || "http://localhost:3001/api/notify";
    const apiKey = process.env.NOTIF_API_KEY || "mi_api_key_super_segura";

    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify(req.body)
    });

    const text = await resp.text();
    try {
      const json = JSON.parse(text);
      return res.status(resp.status).json(json);
    } catch {
      return res.status(resp.status).send(text);
    }
  } catch (err: any) {
    console.error("Error proxy /api/notify:", err);
    return res.status(500).json({ error: "proxy_error", details: String(err) });
  }
}
EOF

