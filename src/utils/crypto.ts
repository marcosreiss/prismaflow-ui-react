const APP_KDF_SALT = "prismaflow::rememberme::v1";
const APP_STATIC_KEY = "prismaflow-remember-me-🔐";

async function deriveKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(APP_STATIC_KEY),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(APP_KDF_SALT),
      iterations: 150000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function b64encode(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function b64decode(b64: string) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
}

export async function encryptJSON<T>(data: T) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey();
  const enc = new TextEncoder();
  const plaintext = enc.encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext
  );
  return {
    iv: b64encode(iv.buffer),
    ct: b64encode(ciphertext),
  };
}

export async function decryptJSON<T>(payload: {
  iv: string;
  ct: string;
}): Promise<T> {
  const key = await deriveKey();
  const iv = new Uint8Array(b64decode(payload.iv));
  const ct = b64decode(payload.ct);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ct
  );
  const dec = new TextDecoder();
  return JSON.parse(dec.decode(decrypted)) as T;
}
