import Cookies from "js-cookie";
import { parse, serialize } from "cookie";

interface CookieOptions {
  expires?: number; // days
  path?: string;
}

export const setCookie = (
  key: string,
  value: string,
  options: CookieOptions = { expires: 7 },
  request?: Request
): string | void => {
  if (typeof window === "undefined" && request) {
    return serialize(key, value, {
      path: options.path || "/",
      maxAge: options.expires ? options.expires * 24 * 60 * 60 : undefined,
    });
  } else {
    Cookies.set(key, value, options);
  }
};
export const getCookie = (key: string, request?: Request): string | undefined => {
  if (typeof window === "undefined") {
    if (!request) return undefined;
    const cookieHeader = request.headers.get("Cookie") || "";
    const cookies = parse(cookieHeader);
    return cookies[key];
  } else {
    return Cookies.get(key);
  }
};



export const removeCookie = (key: string, request?: Request): string | void => {
  if (typeof window === "undefined" && request) {
    return serialize(key, "", {
      path: "/",
      maxAge: 0,
    });
  } else {
    Cookies.remove(key);
  }
};




