const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧹 Faqat kerakli headerlarni olib, default qo‘shish
const buildHeaders = (req) => {
  return {
    "Content-Type": "application/json",
    ...(req.headers.authorization && {
      Authorization: req.headers.authorization,
    }),
  };
};

const buildHeaders2 = (req) => ({
  ...(req.headers["content-type"] && {
    "Content-Type": req.headers["content-type"],
  }),
  ...(req.headers["authorization"] && {
    Authorization: req.headers["authorization"],
  }),
});

// 🔑 /proxy/login
app.post("/proxy/login", async (req, res) => {
  try {
    const response = await axios.post(
      "http://192.0.2.14:40040/api/ext/user/login",
      req.body,
      { headers: buildHeaders(req) }
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
      { headers: buildHeaders(req) }
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
      { headers: buildHeaders(req) }
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
      { headers: buildHeaders(req) }
    );
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Services proxy error");
  }
});

app.post("/proxy/score-univer/post", async (req, res) => {
  try {
    const { url, data } = req.body;
    const response = await axios.post(`${url}`, data, {
      headers: buildHeaders2(req),
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Services proxy error");
  }
});

app.post("/proxy/score-univer/get", async (req, res) => {
  try {
    const { url, query } = req.body; // query — GET parametrlari

    if (!url) {
      return res.status(400).send("URL is required in the request body");
    }

    const response = await axios.get(url, {
      headers: buildHeaders2(req),
      params: query, // bu yerda query-parametrlar yuboriladi
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Services proxy error");
  }
});

app.listen(2002, "0.0.0.0", () => {
  console.log("✅ Proxy server is running on port 2002");
});
