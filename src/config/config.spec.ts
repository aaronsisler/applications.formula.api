import * as config from "./index";

describe("config", () => {
  let configKeys: string[];

  beforeEach(() => {
    configKeys = Object.keys(config);
  });

  it("should export the correct keys", () => {
    expect(configKeys).toContain("TOKEN_VALIDATION_URL");
  });

  it("should export the correct values", () => {
    expect(config.TOKEN_VALIDATION_URL).toBeDefined();
  });
});
