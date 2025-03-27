import axios from "axios";


const BASE_URL = "https://hospital-management-xv96.onrender.com/api" 

const timeOutMessage = "Request took too long to complete. Please try again later.";

const axiosInstance=axios.create({
    baseURL:BASE_URL,
    timeout: 5000,
    timeoutErrorMessage: timeOutMessage,
});

export default axiosInstance;   