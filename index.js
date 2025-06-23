const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔑 /proxy/login
app.post("/proxy/login", async (req, res) => {
  try {
    const response = await axios.post(
      "http://192.0.2.14:40040/api/ext/user/login",
      req.body,
      { headers: req.headers }
    );
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Login proxy error");
  }
});

// 🔁 /proxy/refresh-token
app.post("/proxy/refresh-token", async (req, res) => {
  try {
    const response = await axios.post(
      "http://192.0.2.14:40040/api/ext/user/refresh-token",
      req.body,
      { headers: req.headers }
    );
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Refresh token proxy error");
  }
});

// 💸 /proxy/payment
app.post("/proxy/payment", async (req, res) => {
  try {
    const response = await axios.post(
      "http://192.0.2.14:40040/services/open-api-payment-ms/api/json-rpc",
      req.body,
      { headers: req.headers }
    );
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Payment proxy error");
  }
});

// 📦 /proxy/services
app.post("/proxy/services", async (req, res) => {
  try {
    const response = await axios.post(
      "http://192.0.2.14:40040/services/open-api-services-ms/api/json-rpc",
      req.body,
      { headers: req.headers }
    );
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Services proxy error");
  }
});

app.listen(2002, "0.0.0.0", () => {
  console.log("Proxy server is running on port 2002");
});
