// Utility function to safely stringify objects, handling BigInt values
export function safeStringify(obj: any, space?: number): string {
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    },
    space,
  );
}
