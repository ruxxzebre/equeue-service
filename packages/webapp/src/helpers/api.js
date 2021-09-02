import axios from "axios";

export const getServerURL = () => {
  return `http://${window.location.hostname}:${process.env.VUE_APP_BASE_PORT}/api/v1`;
};

export const API = axios.create({
  baseURL: (() => {
    if (process.env.VUE_APP_BASE_URL) {
      return process.env.VUE_APP_BASE_URL;
    }
    return `http://${window.location.hostname}:${process.env.VUE_APP_BASE_PORT}/api/v1`;
  })(),
  // headers: {
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  // },
});
