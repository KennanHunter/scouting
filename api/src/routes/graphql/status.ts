import { Infer, g } from "garph";
import { APIContext } from "../..";
import { protect } from "../../auth/protected";

export const statusEnum = g.enumType("StatusEnum", [
  "operational",
  "online",
  "offline",
] as const);

export const statusType = g.type("Status", {
  runtime: g.string(),
  authentication: g.string(),
  api: statusEnum,
});

const checkDBConnection = () => {
  // TODO:
  return "operational";
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
): Promise<Infer<typeof statusEnum>> => {
  const status = await fetch("https://www.thebluealliance.com/api/v3/status", {
    headers: {
      "x-tba-auth-key": c.env.TBA_KEY,
    },
  }).then((val) => val.status);

  if (status === 200) return "operational";

  return "offline";
};

// export const statusResolver = async (parent, args, context, info) => ({
//   status: {
//     api: zStatusEnum().Enum.operational,
//     db: checkDBConnection(),
//     thebluealliance: await checkTheBlueAlliance(c),
//   },
//   authentication: await checkAuthentication(c),
//   environment: Object.keys(c.env),
// });
