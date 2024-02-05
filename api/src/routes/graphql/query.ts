import { g } from "garph";
import { Resolvers } from ".";
import { eventType } from "./event";

export const queryType = g.type("Query", {
  allEvents: g.ref(eventType).list(),
});

export const queryResolvers: Resolvers["Query"] = {
  allEvents: async (_parent, _args, context) => {
    console.log(JSON.stringify(context, null, 4));

    const getAllEvents = context.env.DB.prepare("SELECT * FROM Events").bind();

    const allEvents = (await getAllEvents.all()).results;

    console.log(JSON.stringify(allEvents, null, 4));

    return allEvents as any;
  },
};
