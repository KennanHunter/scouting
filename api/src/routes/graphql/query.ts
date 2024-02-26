import { g } from "garph";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { Resolvers } from ".";
import { eventType } from "./event";
import { databaseMatch, matchType } from "./match";

export const queryType = g.type("Query", {
  allEvents: g.ref(eventType).list(),
  getEvent: g.ref(eventType).args({
    key: g.string(),
  }),
  getMatch: g.ref(matchType).args({
    key: g.string(),
  }),
});

const databaseEvent = z.object({
  eventKey: z.string(),
  eventName: z.string(),
  startTime: z.number(),
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
  getEvent: async (_parent, { key }, context) => {
    const eventRaw = context.env.DB.prepare(
      "SELECT * FROM Events WHERE eventKey = ?"
    ).bind(key);

    const eventResult = databaseEvent.safeParse(await eventRaw.first());

    if (!eventResult.success) throw new GraphQLError("Event not found");

    const event = eventResult.data;

    return {
      key: event.eventKey,
      name: event.eventName,
      startTime: new Date(event.startTime),
    };
  },
  getMatch: async (_parent, { key }, context) => {
    const matchRaw = await context.env.DB.prepare(
      "SELECT * FROM Matches WHERE matchKey = ?"
    )
      .bind(key)
      .first();

    if (!matchRaw) throw new GraphQLError("Match not found");

    const matchParseResult = databaseMatch.safeParse(matchRaw);

    if (!matchParseResult.success)
      throw new GraphQLError("Unrecognized match data :(");

    const match = matchParseResult.data;

    return {
      matchKey: match.matchKey,
      eventKey: match.eventKey,
      startTime: match.startTime ? new Date(match.startTime) : undefined,
    };
  },
};
