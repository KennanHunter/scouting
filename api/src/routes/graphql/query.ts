import { g } from "garph";
import { eventType } from "./event";
import { Resolvers } from ".";

export const queryType = g.type("Query", {
  greet: g
    .string()
    .args({
      name: g.string().optional().default("Kennan"),
    })
    .description("Greets a person"),
  allEvents: g.ref(eventType).list(),
});

export const queryResolvers: Resolvers["Query"] = {
  greet: (_, args) => `Hello, ${args.name}`,
  allEvents: () => {
    return [];
  },
};
