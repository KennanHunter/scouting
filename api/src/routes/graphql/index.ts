import { InferResolvers, buildSchema, g } from "garph";
import { createYoga } from "graphql-yoga";
import { APIContext, RouteHandler } from "../..";
import { mutationResolvers, mutationType } from "./mutation";
import { queryResolvers, queryType } from "./query";
import { eventResolvers, eventType } from "./event";

export type Resolvers = InferResolvers<
  {
    Query: typeof queryType;
    Mutation: typeof mutationType;
    Event: typeof eventType;
  },
  { context: APIContext }
>;

const resolvers: Resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Event: eventResolvers,
};

export const schema = buildSchema({ g, resolvers });

export const graphqlHandler: RouteHandler = (context) => {
  return createYoga({
    schema,
    graphiql: false,
    context: () => context,
  }).handle(context.req, context.env);
};
