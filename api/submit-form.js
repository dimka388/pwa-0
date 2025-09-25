export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, and message are required.'
      });
    }

    // Your Google Apps Script URL from environment variable
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: GOOGLE_SCRIPT_URL not set'
      });
    }

    // Forward the request to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'vercel-proxy'
      }),
    });

    if (response.ok) {
      let result;
      try {
        result = await response.json();
      } catch {
        // If response is not JSON, assume success
        result = { success: true, message: 'Form submitted successfully!' };
      }

      return res.status(200).json({
        success: true,
        message: result.message || 'Form submitted successfully!',
        data: result
      });
    } else {
      return res.status(response.status).json({
        success: false,
        message: `Google Apps Script error: ${response.status} ${response.statusText}`
      });
    }

  } catch (error) {
    console.error('Proxy server error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}