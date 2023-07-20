import { Middleware } from "..";

export const addTrailingSlash: Middleware = async (c, next) => {
  if (c.req.url.at(-1) === "/") return await next();
  else return c.redirect(c.req.url + "/", 301);
};
