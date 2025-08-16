import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://employserver.vercel.app' 
});

const useAxiosIns = () => {
    return axiosInstance;
};

export default useAxiosIns;
