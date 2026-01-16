export const LS_KEY_REMEMBER = "pf.remember";
export const LS_KEY_CREDS = "pf.creds";

export function getRememberedStatus(): boolean {
  try {
    return localStorage.getItem(LS_KEY_REMEMBER) === "true";
  } catch {
    return false;
  }
}

export function setRememberedStatus(value: boolean): void {
  try {
    if (value) {
      localStorage.setItem(LS_KEY_REMEMBER, "true");
    } else {
      localStorage.removeItem(LS_KEY_REMEMBER);
    }
  } catch {
    // storage inacessível
  }
}

export function getStoredCredentials(): string | null {
  try {
    return localStorage.getItem(LS_KEY_CREDS);
  } catch {
    return null;
  }
}

export function setStoredCredentials(payload: string): void {
  try {
    localStorage.setItem(LS_KEY_CREDS, payload);
  } catch {
    // storage inacessível
  }
}

export function clearStoredCredentials(): void {
  try {
    localStorage.removeItem(LS_KEY_CREDS);
    localStorage.removeItem(LS_KEY_REMEMBER);
  } catch {
    // storage inacessível
  }
}
