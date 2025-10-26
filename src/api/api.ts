import axios from "axios";

const API = axios.create({
  baseURL: "https://reqres.in/api",
  timeout: 10000,
});

export default API;
