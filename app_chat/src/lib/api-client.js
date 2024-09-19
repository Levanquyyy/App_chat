import { HOST } from "../utilites/constant";
import axios from "axios";
const apiClient = axios.create({
  baseURL: HOST,
});
export default apiClient;
