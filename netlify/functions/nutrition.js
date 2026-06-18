exports.handler = async (event) => {
  const query = event.queryStringParameters?.q;
  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing query' }) };
  }

  const resp = await fetch(
    `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
    { headers: { 'X-Api-Key': 'JByz5h9bZR1XeHIDW6Xns9qL02lrIuU8VEXg1Wif' } }
  );

  const data = await resp.json();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  };
};
