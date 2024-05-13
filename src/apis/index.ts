import { useStore } from "@/stores";
import { message } from "ant-design-vue";
import axios, { AxiosError } from "axios";

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
    (error: AxiosError<{ message: string }>) => {
        if (error.response) {
            if (error.response.data instanceof Blob) {
                const reader = new FileReader();
                reader.readAsText(error.response.data, "utf-8");
                reader.onload = (event) => {
                    const result: { message: string } = JSON.parse(event.target!.result as string);
                    message.error(result.message);
                };
            } else {
                message.error(error.response.data.message);
            }
        } else {
            message.error(error.message);
        }
        return Promise.reject();
    }
);

export const $genScript = (type: "shell" | "bat") => {
    const store = useStore();
    return instance.post<File>(
        "/hosts/gen",
        {
            type,
            data: store.selectedHosts
        },
        {
            responseType: "blob"
        }
    );
};
