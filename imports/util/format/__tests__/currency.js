import { monetize } from "../currency";
import toCurrency from "../currency";

describe ("Monetize", () => {
  it("should handle blank and null input", () => {
    expect(monetize("")).toEqual("$0.00");
    expect(monetize()).toEqual("$0.00");
  });

  it ("should handle normal string inputs with", () => {
    expect(monetize("100")).toEqual("$100");
    expect(monetize("100.50")).toEqual("$100.50");
    expect(monetize("0")).toEqual("$0");
  });

  it ("should handle normal number inputs", () => {
    expect(monetize(100)).toEqual("$100");
    expect(monetize(100.5)).toEqual("$100.50");
    expect(monetize(0.0)).toEqual("$0");
  });

  it ("should return 2 decimal places with fixed arg set", () => {
    expect(monetize("100", true)).toEqual("$100.00");
    expect(monetize(100, true)).toEqual("$100.00");
    expect(monetize("100.50", true)).toEqual("$100.50");
    expect(monetize(100.5, true)).toEqual("$100.50");
    expect(monetize("0", true)).toEqual("$0.00");
    expect(monetize(0.0, true)).toEqual("$0.00");
  });

  const DEFAULT_VALUE = "$0.00";

  it("returns `$0.00` if undefined", () => {
    const result = monetize(undefined);
    expect(result).toBe(DEFAULT_VALUE);
  });

  it("returns `$0.00` if null", () => {
    const result = monetize(null);
    expect(result).toBe(DEFAULT_VALUE);
  });

  it("returns `$12.34` if number 12.34", () => {
    const value = 12.34;
    const result = monetize(value);
    expect(result).toBe(`$${value}`);
  });

  it("returns `$12.34` if string `12.34`", () => {
    const value = "12.34";
    const result = monetize(value);
    expect(result).toBe(`$${value}`);
  });

  it("removes everything except numbers, dots, and dashes", () => {
    const value = "!@#$%^&*()12abcdefg.`~`~{}[]34";
    const result = monetize(value);
    expect(result).toBe("$12.34");
  });

  it("has no decimals by default", () => {
    const value = 24;
    const result = monetize(value);
    expect(result).toBe("$24");
  });

  it("fixes to two decimals if one decimal", () => {
    const value = 24.1;
    const result = monetize(value);
    expect(result).toBe("$24.10");
  });

  it("fixes to two decimals if greater than two", () => {
    const value = 24.2456788;
    const result = monetize(value);
    expect(result).toBe("$24.25");
  });
});

describe("toCurrency", () => {
  it("should convert number in to string representation of money", () => {
    expect(toCurrency(24.35)).toBe("$24.35");
  });
  it("should always fix to two decimal places", () => {
    expect(toCurrency(24)).toBe("$24.00");
    expect(toCurrency(24.3567)).toBe("$24.36");
    expect(toCurrency(24.3)).toBe("$24.30");
  });
});
