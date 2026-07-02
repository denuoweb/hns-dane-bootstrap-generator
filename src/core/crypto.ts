export function base64ToBytes(base64: string): Uint8Array {
  const clean = base64.replace(/\s+/g, '');
  if (typeof atob === 'function') {
    const binary = atob(clean);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  }
  // Node test fallback. The browser bundle should normally use atob().
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bufferCtor = (globalThis as any).Buffer;
  if (!bufferCtor) throw new Error('No base64 decoder available in this runtime.');
  return new Uint8Array(bufferCtor.from(clean, 'base64'));
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export async function digestHex(algorithm: 'SHA-256' | 'SHA-384' | 'SHA-512', data: Uint8Array): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('WebCrypto subtle digest API is not available.');
  }
  const copy = new Uint8Array(data.length);
  copy.set(data);
  const digest = await globalThis.crypto.subtle.digest(algorithm, copy.buffer);
  return bytesToHex(new Uint8Array(digest));
}

export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const length = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return output;
}
