import { z } from "zod";

export const matchDataSchema = z.object({
  amplifications: z.number().nullable(),
  autoamp: z.number().nullable(),
  autonote1: z.boolean().nullable(),
  autonote2: z.boolean().nullable(),
  autonote3: z.boolean().nullable(),
  autonote4: z.boolean().nullable(),
  autonote5: z.boolean().nullable(),
  autonote6: z.boolean().nullable(),
  autonote7: z.boolean().nullable(),
  autonote8: z.boolean().nullable(),
  autospeaker: z.number().nullable(),
  broke: z.boolean().nullable(),
  buddy: z.boolean().nullable(),
  climbtime: z.number().nullable(),
  comments: z.string().nullable(),
  died: z.boolean().nullable(),
  floorpickup: z.number().nullable(),
  harmonizeqty: z.string().nullable(),
  leave: z.boolean().nullable(),
  matchnumber: z.number(),
  noshow: z.boolean(),
  onstageorder: z.string().nullable(),
  playeddefense: z.boolean().nullable(),
  position: z.string().nullable(),
  passednotes: z.number().nullable(),
  rating: z.string().nullable(),
  receiveddefense: z.boolean().nullable(),
  scoutname: z.string(),
  shotfromoutside: z.boolean().nullable(),
  shotfrompodium: z.boolean().nullable(),
  shotfromsubwoofer: z.boolean().nullable(),
  shotfromwing: z.boolean().nullable(),
  sourcepickup: z.number().nullable(),
  spotlit: z.number().nullable(),
  startingpos: z.string().nullable(),
  teamnumber: z.number().nullable(),
  teleopamp: z.number().nullable(),
  teleopspeaker: z.number().nullable(),
  teleoptrap: z.number().nullable(),
  tipped: z.boolean().nullable(),
  understage: z.boolean().nullable(),
});
