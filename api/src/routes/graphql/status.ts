import { builder } from ".";
import { APIContext } from "../..";
import { protect } from "../../auth/protected";

export type StatusEnum = "operational" | "online" | "offline";
export const StatusEnum = builder.enumType("StatusEnum", {
  values: ["operational", "online", "offline"] as const,
});

export const statusType = builder.objectRef<{
  runtime: string;
  authentication: string;
  api: StatusEnum;
}>("Status");

export const checkDBConnection = (): StatusEnum => {
  // TODO:
  return "operational";
};

export const checkAuthenticationStatus = async (
  c: APIContext
): Promise<"valid" | "invalid"> => {
  const res = await protect(c, () => ({}) as any);

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

  if (status === 200) return "operational";

  return "offline";
};
