if (process.env.npm_package_name !== "ao3-toolkit") {
  var header = `Axios/${process.env.npm_package_dependencies_axios} ${process.env.npm_package_name}/ao3-toolkit/Axios/${process.env.npm_package_dependencies_ao3_toolkit} bot`;
} else {
  var header = `Axios/${process.env.npm_package_dependencies_axios} ${process.env.npm_package_name}/${process.env.npm_package_version} bot`;
}

export const axiosDefaults = {
  batch: 10,

  axios: {
    headers: {
      "User-Agent": header,
    },
  },
};
