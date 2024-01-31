function getAxiosUserAgent() {
  switch (true) {
    case process.env.npm_package_name === "ao3-toolkit":
      return `Axios/${process.env.npm_package_dependencies_axios} ${process.env.npm_package_name}/${process.env.npm_package_version} bot`;

    case process.env.npm_package_name === undefined:
      return `Axios packageUsing:ao3-toolkit bot`;

    default:
      return `Axios/${process.env.npm_package_dependencies_axios} ${
        process.env.npm_package_name
      }/${
        process.env.npm_package_version
          ? process.env.npm_package_version
          : "unversioned"
      }/ao3-toolkit/${process.env.npm_package_dependencies_ao3_toolkit} bot`;
  }
}

export const axiosDefaults = {
  batch: 10,

  axios: {
    headers: {
      "User-Agent": getAxiosUserAgent(),
    },
  },
};
