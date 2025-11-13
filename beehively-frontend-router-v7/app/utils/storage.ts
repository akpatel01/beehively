import Cookies from "js-cookie";
import { parse as parseCookie, serialize as serializeCookie } from "cookie";

const isBrowser = typeof document !== "undefined";

export type CookieContext = {
  request?: Request;
  headers?: Headers;
};

// Get cookie from browser or server
export const getCookie = (key: string, context?: CookieContext): string | undefined => {
  if (isBrowser) return Cookies.get(key);

  const header = context?.request?.headers.get("cookie");
  if (!header) return undefined;

  const cookies = parseCookie(header);
  return cookies[key];
};

// Set cookie in browser or server
export const setCookie = (key: string, value: string, context?: CookieContext) => {
  if (isBrowser) {
    Cookies.set(key, value);
  } else if (context?.headers) {
    const serialized = serializeCookie(key, value);
    context.headers.append("Set-Cookie", serialized);
  }
};

// Remove cookie in browser or server
export const removeCookie = (key: string, context?: CookieContext) => {
  if (isBrowser) {
    Cookies.remove(key);
  } else if (context?.headers) {
    const serialized = serializeCookie(key, "", { maxAge: 0 });
    context.headers.append("Set-Cookie", serialized);
  }
};
