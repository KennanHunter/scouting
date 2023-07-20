import { z } from "zod";
import { APIContext, RouteHandler } from "../..";
import { protect } from "../../auth/protected";
import { FieldResolver, enumType, objectType } from "nexus";
import { AbstractTypeResolver } from "nexus/dist/core";

export const zStatusEnum = () => z.enum(["operational", "online", "offline"]);
export type ZStatusEnum = ReturnType<typeof zStatusEnum>;

export const statusEnum = enumType({
  members: ["operational", "online", "offline"],
  name: "StatusEnum",
});

export const statusType = objectType({
  name: "Status",
  definition: (t) => {
    t.string("runtime");
    t.string("authentication");
    t.field("api", {
      type: statusEnum,
    });
  },
});

const checkDBConnection = () => {
  // TODO:
  return statusEnum.value.members;
};

const checkAuthentication = async (
  c: APIContext
): Promise<"valid" | "invalid"> => {
  const res = await protect(c, () => ({}) as any);

  if (res) return "invalid";

  return "valid";
};

const checkTheBlueAlliance = async (
  c: APIContext
): Promise<z.infer<ZStatusEnum>> => {
  const status = await fetch("https://www.thebluealliance.com/api/v3/status", {
    headers: {
      "x-tba-auth-key": c.env.TBA_KEY,
    },
  }).then((val) => val.status);

  if (status === 200) return zStatusEnum().enum.operational;

  return zStatusEnum().enum.offline;
};

export const statusResolver: FieldResolver<"Query", "status"> = async (
  root,
  c,
  info
) => ({
  status: {
    api: zStatusEnum().Enum.operational,
    db: checkDBConnection(),
    thebluealliance: await checkTheBlueAlliance(c),
  },
  authentication: await checkAuthentication(c),
  environment: Object.keys(c.env),
});
