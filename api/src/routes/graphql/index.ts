import { graphqlServer } from "@hono/graphql-server";
import { buildSchema, g } from "garph";
import { RouteHandler } from "../..";
import { queryResolvers } from "./query";

export const schema = buildSchema({ g, resolvers: queryResolvers });

export const graphqlHandler: RouteHandler = graphqlServer({
  schema,
  pretty: true,
});
