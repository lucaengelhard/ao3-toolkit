var batch = 10;
var listBuffer = [];
let cachePath = "./data/cache";
let axios = {
    headers: {
        "User-Agent": "Axios/1.3.5 ao3-toolkit bot",
    },
};
export let defaults = {
    batch,
    listBuffer,
    cachePath,
    axios,
};
