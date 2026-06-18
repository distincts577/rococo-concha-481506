const https = require('https');

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch(e) { reject(new Error('JSON parse error: ' + body.slice(0,100))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

exports.handler = async (event) => {
  const query = event.queryStringParameters && event.queryStringParameters.q;
  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing query' }) };
  }

  try {
    const url = 'https://api.calorieninjas.com/v1/nutrition?query=' + encodeURIComponent(query);
    const data = await httpsGet(url, { 'X-Api-Key': 'JByz5h9bZR1XeHIDW6Xns9qL02lrIuU8VEXg1Wif' });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
