import { z } from "zod";
import { RouteHandler } from "../..";
import { importEvent } from "../../connections/thebluealliance/importEvent";

export const newEventHandler: RouteHandler = async (c) => {
  const { id } = c.req.param();

  const knownEvents = z
    .string()
    .array()
    .parse(
      (
        await c.env.DB.prepare("SELECT eventKey FROM Events").all()
      ).results.flat()
    );

  if (knownEvents.includes(id)) return c.text(`Event ${id} already imported`);

  importEvent(c, id);

  return c.json({});
};
