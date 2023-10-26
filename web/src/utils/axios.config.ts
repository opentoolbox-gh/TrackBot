import Axios from "axios";

export const axios = Axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:3000" : "https://trackbot.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});
