import { CookieSerializeOptions } from "next/dist/server/web/types";

export const cookieOptions: CookieSerializeOptions = {
  domain: process.env.NODE_ENV === "development" ? 'localhost' : ".grupomavedigital.com.br",
  maxAge: 1000 * 60 * 15, // would expire after 15 minutes
  httpOnly: true, // The cookie only accessible by the web server
  sameSite: "strict", // Enforces the "SameSite" cookie attribute for Session Cookies.
  secure: process.env.NODE_ENV === "development" ? false : true, // Indicates if the cookie should only be transmitted over a secure HTTPS connection from the client
};