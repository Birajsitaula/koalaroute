// export const BASE_URL = "http://localhost:5000/api";
// src/config.js
export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8888/.netlify/functions/api"
    : "https://your-netlify-site.netlify.app/.netlify/functions/api";
