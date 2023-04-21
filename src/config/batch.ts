import { AxiosResponse } from "axios";
import ao3 from "..";

export var batch: number = 10;

export var listBuffer: AxiosResponse<any, any>[];
