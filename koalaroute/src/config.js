// export const BASE_URL = "http://localhost:5000/api";

export const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BASE_URL
    : import.meta.env.VITE_BASE_URL_PROD;
