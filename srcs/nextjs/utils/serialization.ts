/**
 * Utility functions for safely serializing objects containing BigInt values
 */

/**
 * Recursively converts BigInt values to strings in an object
 * @param obj - The object to convert
 * @returns A new object with BigInt values converted to strings
 */
export function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }

  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = convertBigIntToString(obj[key]);
      }
    }
    return result;
  }

  return obj;
}

/**
 * Safely stringify an object containing BigInt values
 * @param obj - The object to stringify
 * @param space - Optional space parameter for JSON.stringify (for formatting)
 * @returns JSON string representation of the object
 */
export function safeStringify(obj: any, space?: string | number): string {
  try {
    const converted = convertBigIntToString(obj);
    return JSON.stringify(converted, null, space);
  } catch (error) {
    console.error('Error in safeStringify:', error);
    return JSON.stringify({ error: 'Failed to serialize object' }, null, space);
  }
}

/**
 * A replacement for JSON.stringify that handles BigInt values
 * @param value - The value to stringify
 * @param replacer - Optional replacer function
 * @param space - Optional space parameter for formatting
 * @returns JSON string representation
 */
export function bigIntReplacer(key: string, value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}
