import { InferResolvers, buildSchema, g } from "garph";
import { createYoga } from "graphql-yoga";
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

export const graphqlHandler: RouteHandler = (context) => {
  return createYoga({
    schema,
    context: () => context,
  }).handle(context.req, context.env);
};
