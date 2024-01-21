import { graphqlServer } from "@hono/graphql-server";
import { InferResolvers, buildSchema, g } from "garph";
import { APIContext, RouteHandler } from "../..";
import { mutationResolvers, mutationType } from "./mutation";
import { queryResolvers, queryType } from "./query";

export type Resolvers = InferResolvers<
  { Query: typeof queryType; Mutation: typeof mutationType },
  { context: APIContext }
>;

const resolvers: Resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};

export const schema = buildSchema({ g, resolvers });

export const graphqlHandler: RouteHandler = graphqlServer({
  schema,
  pretty: true,
});
