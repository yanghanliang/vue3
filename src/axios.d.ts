import axios from "axios";
declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosInstance): Promise<any>
  }
}