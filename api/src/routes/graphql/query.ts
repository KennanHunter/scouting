import { InferResolvers, g } from "garph";
import { APIContext } from "../..";
import { eventType } from "./event";

export const queryResolvers: InferResolvers<
  { Query: typeof queryType },
  { context: APIContext }
> = {
  Query: {
    events: (parent, args, c) => {
      console.log(JSON.stringify(c, null, 4));
      return [];
      // return c.env.DB.prepare("SELECT eventKey FROM Events").all() as any;
    },
  },
};

export const queryType = g.type("Query", {
  events: g.ref(eventType).list(),
});
