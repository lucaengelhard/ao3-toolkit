import JestConfigWithTsJest from "ts-jest";
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.ts"],
};
