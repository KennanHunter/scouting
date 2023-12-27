import { graphqlServer } from "@hono/graphql-server";
import { APIContext, RouteHandler } from "../..";
import { InferResolvers, g, buildSchema } from "garph";

const queryType = g.type("Query", {
  greet: g
    .string()
    .args({
      name: g.string().optional().default("Kennan"),
    })
    .description("Greets a person"),
});

const resolvers: InferResolvers<
  { Query: typeof queryType },
  { context: APIContext }
> = {
  Query: {
    greet: (parent, args, context, info) => `Hello, ${args.name}`,
  },
};

const schema = buildSchema({ g, resolvers });

export const graphqlHandler: RouteHandler = graphqlServer({
  schema,
  pretty: true,
});
