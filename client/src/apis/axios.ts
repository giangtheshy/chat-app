import axios from "axios";
import store from "../store/store";

export const ENTRY_POINT = process.env.NODE_ENV==="production" ?"https://phim-pro-azure.tk":"http://localhost"

const axiosInstance = axios.create({
  baseURL: `${ENTRY_POINT}/api/v1`,
});

axiosInstance.interceptors.request.use(function (config) {
  const token = store.getState().user.token;
  config.headers.Authorization = token;

  return config;
});
axiosInstance.interceptors.response.use(
  (response) =>
    new Promise((resolve, reject) => {
      resolve(response);
    }),
  (error) => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
    if (error.response.status === 403) {
      // alert("Phiên đăng nhập đã hết hạn! Trang web sẽ tự động refresh để tiếp tục...");
      // window.location.reload();
      return new Promise((resolve, reject) => {
        reject(error);
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  },
);

export default axiosInstance;
