import { g } from "garph";
import { APIContext } from "../..";
import { protect } from "../../auth/protected";

enum StatusEnum {
  operational,
  online,
  offline,
}

export const statusEnum = g.enumType("StatusEnum", StatusEnum);

export const statusType = g.type("Status", {
  runtime: g.string(),
  authentication: g.string(),
  api: statusEnum,
});

export const checkDBConnection = (): StatusEnum => {
  // TODO:
  return StatusEnum.operational;
};

export const checkAuthenticationStatus = async (
  c: APIContext
): Promise<"valid" | "invalid"> => {
  const res = await protect(c as any, () => ({}) as any);

  if (res) return "invalid";

  return "valid";
};

export const checkTheBlueAllianceStatus = async (
  c: APIContext
): Promise<StatusEnum> => {
  const status = await fetch("https://www.thebluealliance.com/api/v3/status", {
    headers: {
      "x-tba-auth-key": c.env.TBA_KEY,
    },
  }).then((val) => val.status);

  if (status === 200) return StatusEnum.operational;

  return StatusEnum.offline;
};
