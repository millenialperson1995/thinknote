import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASEURL,
});

export default api;

// aula 2:49