import { g } from "garph";
import { z } from "zod";

export const teamType = g.type("Team", {
  teamName: g.string(),
  teamNumber: g
    .int()
    .description("FRC Team Number, 0-9999 as of February 2024"),
  nickname: g.string(),
});
export const teamTypeZodSchema = z.object({
  teamNumber: z.number(),
  teamName: z.string(),
  nickname: z.string(),
});
