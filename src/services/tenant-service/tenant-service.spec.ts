import { TenantService } from "./index";

describe("services/TenantService", () => {
  let tenantService: TenantService;

  beforeEach(() => {
    tenantService = new TenantService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof TenantService).toEqual("function");
    expect(typeof tenantService).toEqual("object");
  });
});
