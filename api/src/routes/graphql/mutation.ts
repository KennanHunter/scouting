import { GraphQLError } from "graphql";
import { typeAdder } from ".";
import { fetchTBA } from "../../connections/thebluealliance/client";
import { simpleEventSchema } from "../../connections/thebluealliance/type/simpleEventSchema";
import { FRCEvent } from "./types";

// export const mutationResolvers: Resolvers["Mutation"] = {
//   importEvent: (_, { id }, context) => {
//     console.log(JSON.stringify(context, null, 4));

//     const data = simpleEventSchema.safeParse(
//       fetchTBA(`/event/${id}`, context.env.TBA_KEY)
//     );

//     if (!data.success)
//       throw new GraphQLError("Invalid Data Received from The Blue Alliance");

//     const event = data.data;

//     return {
//       id: event.key,
//       name: event.name,
//     };
//   },
// };

export const addMutation: typeAdder = (schema) =>
  schema.mutationType({
    fields: (t) => ({
      importEvent: t.field({
        type: FRCEvent,
        args: {
          id: t.arg.string({
            required: true,
            description: "ID of event to be imported",
          }),
        },
        resolve: (parent, { id }, context) => {
          console.log(JSON.stringify(context, null, 4));

          const data = simpleEventSchema.safeParse(
            fetchTBA(`/event/${id}`, context.env.TBA_KEY)
          );

          if (!data.success)
            throw new GraphQLError(
              "Invalid Data Received from The Blue Alliance"
            );

          const event = data.data;

          return {
            id: event.key,
            name: event.name,
          };
        },
      }),
    }),
  });
