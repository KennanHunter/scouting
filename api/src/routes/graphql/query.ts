import { g } from "garph";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { Resolvers } from ".";
import { eventType } from "./event";

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

const matchEntryJoinResult = z.object({
  matchKey: z.string(),
  startTime: z.number(),
  eventKey: z.string(),
  teamNumber: z.number(),
  alliance: z.string(),
  matchData: z.string(),
});

export const queryResolvers: Resolvers["Query"] = {
  allEvents: async (_parent, _args, context, info) => {
    const getAllEvents = context.env.DB.prepare("SELECT * FROM Events").bind();

    const allEventsRaw = (await getAllEvents.all()).results;

    const events = databaseEvent.array().parse(allEventsRaw);

    return events.map((event) => ({
      key: event.eventKey,
      name: event.eventName,
      startTime: new Date(event.startTime),
    }));
  },
  getEvent: async (_parent, { id }, context) => {
    const eventRaw = context.env.DB.prepare(
      "SELECT * FROM Events WHERE eventKey = ?"
    ).bind(id);

    const eventResult = databaseEvent.safeParse(await eventRaw.first());

    if (!eventResult.success) throw new GraphQLError("Event not found");

    const event = eventResult.data;

    return {
      key: event.eventKey,
      name: event.eventName,
      startTime: new Date(event.startTime),
    };
  },
};
