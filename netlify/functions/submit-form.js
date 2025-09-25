const { Handler } = require('@netlify/functions');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const formData = JSON.parse(event.body);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields: name, email, and message are required.'
        })
      };
    }

    // Your Google Apps Script URL
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzzK1haMLCr34L-Iin14Eo6q9etJ2EY6inPPrMlSm1qGDOgAM7uTC4NdaaS67nIZ8ju/exec';

    // Forward the request to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'netlify-proxy'
      }),
    });

    if (response.ok) {
      let result;
      try {
        result = await response.json();
      } catch {
        result = { success: true, message: 'Form submitted successfully!' };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: result.message || 'Form submitted successfully!',
          data: result
        })
      };
    } else {
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: `Google Apps Script error: ${response.status} ${response.statusText}`
        })
      };
    }

  } catch (error) {
    console.error('Netlify function error:', error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

module.exports = { handler };