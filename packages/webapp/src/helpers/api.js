import axios from "axios";
import { ipconfig } from "@bwi/shared/configs";

export const API = axios.create({
  baseURL: ipconfig.ip,
  headers: {
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});
