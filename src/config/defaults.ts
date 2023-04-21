import { AxiosResponse } from "axios";

export var batch: number = 10;

export var listBuffer: AxiosResponse<any, any>[];

export let cachePath = "./data/cache";

export let axios = {
  headers: {
    "User-Agent": "Axios/1.3.5 ao3-toolkit bot",
  },
};
