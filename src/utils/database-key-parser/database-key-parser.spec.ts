import { uuidGenerator } from "./index";

describe("utils:uuidGenerator", () => {
  beforeEach(() => {});

  afterEach(() => {});

  it("should be a function", () => {
    expect(typeof uuidGenerator).toEqual("function");
  });

  it("should create a uuid correctly", () => {
    const uuid = uuidGenerator();
    const uuidParts = uuid.split("-");

    expect(uuid).toHaveLength(36);

    expect(uuidParts).toHaveLength(5);

    expect(uuidParts[0]).toHaveLength(8);
    expect(uuidParts[1]).toHaveLength(4);
    expect(uuidParts[2]).toHaveLength(4);
    expect(uuidParts[3]).toHaveLength(4);
    expect(uuidParts[4]).toHaveLength(12);
  });
});
