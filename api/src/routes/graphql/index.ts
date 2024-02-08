import { InferResolvers, buildSchema, g } from "garph";
import { createYoga } from "graphql-yoga";
import { APIContext, RouteHandler } from "../..";
import { eventResolvers, eventType } from "./event";
import { matchResolvers, matchType } from "./match";
import { mutationResolvers, mutationType } from "./mutation";
import { queryResolvers, queryType } from "./query";

export type Resolvers = InferResolvers<
  {
    Query: typeof queryType;
    Mutation: typeof mutationType;
    Event: typeof eventType;
    Match: typeof matchType;
  },
  { context: APIContext }
>;

const resolvers: Resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Event: eventResolvers,
  Match: matchResolvers,
};

export const schema = buildSchema({ g, resolvers });

export const graphqlHandler: RouteHandler = (context) => {
  return createYoga({
    schema,
    graphiql: false,
    context: () => context,
  }).handle(context.req, context.env);
};
