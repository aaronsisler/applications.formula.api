import * as config from "./index";

describe("config", () => {
  let configKeys: string[];

  beforeEach(() => {
    configKeys = Object.keys(config);
  });

  it("should export the correct keys", () => {
    expect(configKeys).toContain("TOKEN_VALIDATION_URL");
    expect(configKeys).toContain("TABLE_NAME");
    expect(configKeys).toContain("QUEUE_NAME");
    expect(configKeys).toContain("QUEUE_URL");
  });

  it("should export the correct values", () => {
    expect(config.TOKEN_VALIDATION_URL).toBeDefined();
    expect(config.TABLE_NAME).toBeDefined();
    expect(config.QUEUE_NAME).toBeDefined();
    expect(config.QUEUE_URL).toBeDefined();
  });
});
