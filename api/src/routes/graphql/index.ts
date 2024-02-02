import SchemaBuilder from "@pothos/core";
import { createYoga } from "graphql-yoga";
import { APIContext, RouteHandler } from "../..";
import { addMutation } from "./mutation";
import { addQuery } from "./query";
import { addTypes } from "./types";

export const builder = new SchemaBuilder<{
  Context: APIContext;
}>({});

export type typeAdder = (schema: typeof builder) => unknown;

addQuery(builder);
addMutation(builder);
addTypes(builder);

const schema = builder.toSchema();
export const graphqlHandler: RouteHandler = (context) => {
  // console.log(JSON.stringify(context, null, 4));

  // return graphqlServer<{ Bindings: Bindings }>({
  //   schema: builder.toSchema({
  //     sortSchema: true,
  //   }),
  //   pretty: true,
  // })(context);

  return createYoga({
    schema,
  }).handle(context.req, context.env);
};
