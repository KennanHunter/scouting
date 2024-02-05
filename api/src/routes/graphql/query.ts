import { g } from "garph";
import { Resolvers } from ".";
import { eventType } from "./event";
import { z } from "zod";
import { teamTypeZodSchema } from "./team";
import { GraphQLError } from "graphql";

export const queryType = g.type("Query", {
  allEvents: g.ref(eventType).list(),
  getEvent: g.ref(eventType).args({
    id: g.string(),
  }),
});

const databaseEvent = z.object({
  eventKey: z.string(),
  eventName: z.string(),
  startTime: z.number(),
});

export const queryResolvers: Resolvers["Query"] = {
  allEvents: async (_parent, _args, context) => {
    const getAllEvents = context.env.DB.prepare("SELECT * FROM Events").bind();

    const allEventsRaw = (await getAllEvents.all()).results;

    const events = databaseEvent.array().parse(allEventsRaw);

    // TODO: use DB.batch
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
        startTime: new Date(event.startTime),
        teams: teamTypeZodSchema.array().parse(teams),
      };
    });

    return await Promise.all(eventPromises);
  },
  getEvent: async (_parent, { id }, context) => {
    const eventRaw = context.env.DB.prepare(
      "SELECT * FROM Events WHERE eventKey = ?"
    ).bind(id);

    const eventResult = databaseEvent.safeParse(await eventRaw.first());

    if (!eventResult.success) throw new GraphQLError("Event not found");

    const event = eventResult.data;

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
      startTime: new Date(event.startTime),
      teams: teamTypeZodSchema.array().parse(teams),
    };
  },
};
