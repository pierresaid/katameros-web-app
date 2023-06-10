import axios from "axios";

const http = axios.create({
  baseURL: "https://api.katameros.app",
});

export default http;
