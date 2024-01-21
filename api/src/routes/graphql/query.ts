import { g } from "garph";
import { eventType } from "./event";
import { Resolvers } from ".";

export const queryType = g.type("Query", {
  allEvents: g.ref(eventType).list(),
});

export const queryResolvers: Resolvers["Query"] = {
  allEvents: async (_parent, _args, context) => {
    const getAllEvents = context.env.DB.prepare("SELECT * FROM Events").bind();

    const allEvents = (await getAllEvents.all()).results;

    return allEvents as any;
  },
};
