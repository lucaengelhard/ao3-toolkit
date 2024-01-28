import { AxiosResponse } from "axios";

const listBuffer: AxiosResponse<any, any>[] = [];

export const axiosDefaults = {
  batch: 10,
  listBuffer,
  cachePath: "./data/cache",
  axios: {
    headers: {
      "User-Agent": "Axios/1.3.5 ao3-toolkit bot",
    },
  },
};
