import * as jose from "jose";
import { Middleware } from "..";
import { z } from "zod";

export const jwtPayload = () =>
  z.object({
    applicationID: z.number().int(),
    applicationName: z.string(),
  });

export type JwtPayload = z.infer<ReturnType<typeof jwtPayload>>;

export const protect: Middleware = async (c, next) => {
  const authorizationHeader = c.req.header("Authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return c.text("Unauthenticated", 401);
  }

  const jwt = authorizationHeader.substring(8);

  const jwtSecret = jose.base64url.decode(c.env.JWT_SECRET);

  const jwtResult = await jose
    .jwtDecrypt(jwt, jwtSecret)
    .catch(() => c.text("Unauthenticated", 401));

  if (jwtResult instanceof Response) return jwtResult;

  const jwtPayloadParseResult = jwtPayload().safeParse(jwtResult.payload);

  if (!jwtPayloadParseResult.success) return c.text("Unauthenticated", 401);

  c.res.headers.append(
    "applicationId",
    jwtPayloadParseResult.data.applicationID.toString()
  );
  c.res.headers.append(
    "applicationName",
    jwtPayloadParseResult.data.applicationName
  );

  return await next();
};
