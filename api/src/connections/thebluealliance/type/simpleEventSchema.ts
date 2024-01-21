import { z } from "zod";

export const simpleEventSchema = z.object({
  key: z.string(),
  name: z.string(),
  event_code: z.string(),
  event_type: z.number(),
  district: z.object({
    abbreviation: z.string(),
    display_name: z.string(),
    key: z.string(),
    year: z.number(),
  }),
  city: z.string(),
  state_prov: z.string(),
  country: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  year: z.number(),
});
