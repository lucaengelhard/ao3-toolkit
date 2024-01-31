import { axiosDefaults } from "../src";

test("get the name of the main module and add it to the axios request header", () => {
  expect(axiosDefaults.axios.headers["User-Agent"]).toBe(
    `Axios/${process.env.npm_package_dependencies_axios} ${process.env.npm_package_name}/${process.env.npm_package_version} bot`
  );
});
