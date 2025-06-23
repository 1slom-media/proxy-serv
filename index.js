// proxy.js
const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Universal proxy: GET, POST, PUT, DELETE — hammasi ishlaydi
app.all("/proxy", async (req, res) => {
  try {
    const { method, headers, body, query } = req;

    const apiUrl =
      "http://192.0.2.14:40040/services/open-api-payment-ms/api/json-rpc"; // API manzilingiz shu yerga

    const response = await axios({
      method,
      url: apiUrl,
      headers,
      params: query,
      data: body,
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Proxy error");
  }
});

app.listen(2002, () => {
  console.log("Proxy server is running on port 3001");
});
