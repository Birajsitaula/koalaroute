// export const BASE_URL = "http://localhost:5000/api";

export const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api"; // Use relative path for production
