import axios from "axios";
// import { ipconfig } from "@bwi/shared/configs";

export const API = axios.create({
  baseURL: (() => {
    if (process.env.VUE_APP_BASE_URL) {
      return process.env.VUE_APP_BASE_URL;
    }
    // TODO: ssl
    return `http://${window.location.hostname}:${process.env.VUE_APP_BASE_PORT}/api`;
  })(),
  // headers: {
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  // },
});
