import axios from "axios";

// const LOCAL_API_URL = Platform.select({
//   android: "http://192.168.80.1:3000/api/v1",
//   ios: "http://192.168.80.1:3000/api/v1",
//   default: "http://localhost:3000/api/v1",
// });
const LOCAL_API_URL = "https://ecommerce-app-backend-server.vercel.app/api/v1";
console.log("API Base URL:", LOCAL_API_URL);

const api = axios.create({
  baseURL: LOCAL_API_URL,
});

export default api;
