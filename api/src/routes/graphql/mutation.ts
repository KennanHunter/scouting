import { g } from "garph";
import { GraphQLError } from "graphql";
import { Resolvers } from ".";
import { fetchTBA } from "../../connections/thebluealliance/client";
import { simpleEventSchema } from "../../connections/thebluealliance/type/simpleEventSchema";
import { eventType } from "./event";

export const mutationType = g.type("Mutation", {
  importEvent: g
    .ref(eventType)
    .args({
      id: g.string(),
    })
    .description("Importing latest events"),
});

export const mutationResolvers: Resolvers["Mutation"] = {
  importEvent: (_, { id }, context) => {
    console.log(JSON.stringify(context, null, 4));

    const data = simpleEventSchema.safeParse(
      fetchTBA(`/event/${id}`, context.env.TBA_KEY)
    );

    if (!data.success)
      throw new GraphQLError("Invalid Data Received from The Blue Alliance");

    const event = data.data;

    return {
      id: event.key,
      name: event.name,
    };
  },
};
