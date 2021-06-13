import axios, { AxiosResponse, AxiosTransformer, Method } from 'axios';

interface RequestConfig {
    url?: string;
    method?: Method;
    baseURL?: string;
    transformRequest?: AxiosTransformer | AxiosTransformer[];
    transformResponse?: AxiosTransformer | AxiosTransformer[];
    headers?: any;
    params?: any;
    paramsSerializer?: (params: any) => string;
    data?: any;
    timeout?: number;
}

export class Request {
    public static async get(resource: string, config?: any): Promise<AxiosResponse> {
        return await axios.get(resource, config);
    }

    public static async post(resource: string, data?: any, config?: any): Promise<AxiosResponse> {
        return await axios.post(resource, data, config);
    }

    public static async put(resource: string, data?: any, config?: any): Promise<AxiosResponse> {
        return axios.put(resource, data, config);
    }

    public static async delete(resource: string, config?: any): Promise<AxiosResponse> {
        return axios.delete(resource, config);
    }

    public static async patch(resource: string, data?: any, config?: any): Promise<AxiosResponse> {
        return axios.patch(resource, data, config);
    }

    /**
     * data is an object containing the following properties:
     *  - method
     *  - url
     *  - data ... request payload
     *  - auth (optional)
     *    - username
     *    - password
     **/

    async request(data: RequestConfig): Promise<AxiosResponse> {
        return axios(data);
    }
}
