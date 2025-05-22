import { Buffer } from "node:buffer";

/**
 * Convert an array of hex strings to a buffer with trimmed zeros.
 * For example: ["0x1234567890abcdef", "0xabcdef1234567890"] -> Buffer([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
 * @param hexStrings - An array of hex strings.
 * @returns A buffer containing the concatenated hex strings.
 */
export function hexStringsToBufferWithTrimmedZeros(
  hexStrings: string[],
): Buffer {
  if (!hexStrings || hexStrings.length === 0) {
    return Buffer.alloc(0);
  }

  const buffers: Buffer[] = hexStrings.map((hexString) => {
    const cleanHexString = hexString.startsWith("0x")
      ? hexString.slice(2)
      : hexString;
    // Assuming each string is a valid hex representation of 32 bytes,
    // so cleanHexString.length should be 64.
    // No explicit validation here as per problem description focusing on the conversion and trimming.
    return Buffer.from(cleanHexString, "hex");
  });

  const combinedBuffer = Buffer.concat(buffers);

  if (combinedBuffer.length === 0) {
    return combinedBuffer;
  }

  let end = combinedBuffer.length;
  while (end > 0 && combinedBuffer[end - 1] === 0) {
    end--;
  }

  return combinedBuffer.subarray(0, end);
}
