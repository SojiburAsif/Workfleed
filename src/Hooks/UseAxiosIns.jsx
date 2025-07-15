import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000'  // <-- এখানে শুধু string দিবে, array নয়
});

const useAxiosIns = () => {
    return axiosInstance;
};

export default useAxiosIns;
