import { z } from "zod";

export const TBATeamSchema = z.object({
  key: z.string(),
  team_number: z.number(),
  nickname: z.string().optional(),
  name: z.string(),
  city: z.string(),
  state_prov: z.string(),
  country: z.string(),
});
