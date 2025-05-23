import axios from "axios";

const BASE_URL = "http://localhost:5000/";
// const BASE_URL = "https://tgcrm-new-api.vercel.app";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
