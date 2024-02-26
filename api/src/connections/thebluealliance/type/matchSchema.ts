import { z } from "zod";

export const TBAMatchSchema = z.object({
  comp_level: z.string(),
  match_number: z.number(),
  time_string: z.string().optional(),
  set_number: z.number(),
  key: z.string(),
  time: z.number(),
  actualtime: z.number().optional(),
  winningAlliance: z.literal("red").or(z.literal("blue")).optional(),
  score_breakdown: z.unknown(),
  alliances: z.object({
    blue: z.object({
      score: z.number().optional(),
      team_keys: z.string().array().optional(),
    }),
    red: z.object({
      score: z.number().optional(),
      team_keys: z.string().array().optional(),
    }),
  }),
  event_key: z.string(),
});
