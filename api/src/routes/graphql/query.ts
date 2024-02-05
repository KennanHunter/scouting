import { g } from "garph";
import { Resolvers } from ".";
import { eventType } from "./event";
import { z } from "zod";
import { teamTypeZodSchema } from "./team";

export const queryType = g.type("Query", {
  allEvents: g.ref(eventType).list(),
});

const databaseEvent = z.object({
  eventKey: z.string(),
  eventName: z.string(),
  startTime: z.number(),
});

export const queryResolvers: Resolvers["Query"] = {
  allEvents: async (_parent, _args, context) => {
    console.log(JSON.stringify(context, null, 4));

    const getAllEvents = context.env.DB.prepare("SELECT * FROM Events").bind();

    const allEventsRaw = (await getAllEvents.all()).results;

    console.log(JSON.stringify(allEventsRaw, null, 4));

    const events = databaseEvent.array().parse(allEventsRaw);

    const eventPromises = events.map(async (event) => {
      const teams = (
        await context.env.DB.prepare(
          "SELECT * FROM TeamEventAppearance, Teams WHERE Teams.teamNumber = TeamEventAppearance.teamNumber AND eventKey = ?"
        )
          .bind(event.eventKey)
          .all()
      ).results;

      return {
        key: event.eventKey,
        name: event.eventName,
        startTime: event.startTime,
        teams: teamTypeZodSchema.array().parse(teams),
      };
    });

    return await Promise.all(eventPromises);
  },
};
