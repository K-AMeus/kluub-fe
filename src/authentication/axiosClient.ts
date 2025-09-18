import axios from "axios";
import { firebaseAuth } from "./firebaseConfig";

const axiosClient = axios.create({
  baseURL: "https://kluub-be-production.up.railway.app",
});

axiosClient.interceptors.request.use(
  async (config) => {
    const user = firebaseAuth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
