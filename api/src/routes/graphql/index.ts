import { graphqlServer } from "@hono/graphql-server";
import SchemaBuilder from "@pothos/core";
import { Bindings, RouteHandler } from "../..";
import { addQuery } from "./query";

export const builder = new SchemaBuilder<{
  Context: Bindings;
}>({});

export type typeAdder = (schema: typeof builder) => unknown;

addQuery(builder);

export const graphqlHandler: RouteHandler = (context) => {
  // console.log(JSON.stringify(context, null, 4));

  return graphqlServer<{ Bindings: Bindings }>({
    schema: builder.toSchema({
      sortSchema: true,
    }),
    pretty: true,
  })(context);
};
