import * as jose from "jose";
import { JwtPayload } from "types";
import { RouteHandler } from "../..";
import { successfulResponse } from "../../util/generateResponse";
import { z } from "zod";

export const generateHandler: RouteHandler = async (c) => {
  const secret = jose.base64url.decode(c.env.JWT_SECRET);

  const jwt = await new jose.EncryptJWT({
    applicationID: 1,
    applicationName: "development-id",
  } as JwtPayload)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setIssuedAt()
    .encrypt(secret);

  console.log(JSON.stringify(await jose.jwtDecrypt(jwt, secret), null, 4));

  return successfulResponse(z.object({ jwt: z.string() }), {
    jwt,
  });
};
