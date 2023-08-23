const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8008;

app.use(express.json());

const TIMEOUT_MS = 500;

async function fetchNumbers(url) {
  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS }); 
    return response.data.numbers || [];
  } catch (error) {
    return [];
  }
}

app.get('/numbers', async (req, res) => {
  const urls = await req.query.url;
//   console.log(urls)
  const fetchPromises = urls.map(url => fetchNumbers(url));
  const numbersLists = await Promise.all(fetchPromises);

  const mergedNumbers =await Array.from(
    new Set(numbersLists.flat())
  ).sort((a, b) => a - b);

  res.json({ numbers: mergedNumbers });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});