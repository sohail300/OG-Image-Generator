import axios from "axios";

// export const BACKEND_URL = "http://localhost:3000";
export const BACKEND_URL = "https://backend-og-image.heysohail.me";

export const api = axios.create({
  baseURL: BACKEND_URL,
});
