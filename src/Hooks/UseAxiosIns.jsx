import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://employserver.vercel.app'  // <-- এখানে শুধু string দিবে, array নয়
});

const useAxiosIns = () => {
    return axiosInstance;
};

export default useAxiosIns;
