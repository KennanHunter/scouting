import { graphqlServer } from "@hono/graphql-server";
import { makeSchema, queryType } from "nexus";
import { RouteHandler } from "../..";
import { statusResolver, statusType } from "./status";

const Query = queryType({
  definition(t) {
    t.field("status", {
      type: statusType,
      resolve: statusResolver,
    });
  },
});

const schema = makeSchema({
  types: [Query],
});

export const graphqlHandler: RouteHandler = (c) =>
  graphqlServer({
    schema,
  });
