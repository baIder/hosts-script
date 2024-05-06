import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.PROD ? import.meta.env.VITE_BASE_URL : "/api",
    timeout: 6000
});

instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const $genScript = (data: Hosts[]) => {
    return instance.post<File>(
        "/hosts/gen",
        {
            data
        },
        {
            responseType: "blob"
        }
    );
};
