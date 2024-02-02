import {
  InputShapeFromFields,
  InputFieldMap,
  MaybePromise,
} from "@pothos/core";
import { GraphQLResolveInfo } from "graphql";
import { builder, typeAdder } from ".";
import { APIContext } from "../..";
import {
  StatusEnum,
  checkAuthenticationStatus,
  checkDBConnection,
} from "./status";

export const addTypes: typeAdder = (schema) => {};

export const FRCEvent = builder.objectRef<{
  id: string;
  name: string;
}>("Event");

export const StatusType = builder
  .objectRef<{
    status: {
      api: StatusEnum;
      db: StatusEnum;
      thebluealliance: StatusEnum;
    };
    authentication: string;
    environment: Array<string>;
  }>("Status")
  .implement({
    description: "Current status of API",
    fields: (t) => ({
      status: {
        api: t.field({
          type: StatusEnum,
          resolve: () => {
            return "operational" as const;
          },
        }),
        db: t.field({
          type: StatusEnum,
          resolve: (_, {}, c) => checkDBConnection(),
        }),
        theBlueAlliance: t.field({
          type: "String",
          resolve: (_, {}, c) => checkAuthenticationStatus(c),
        }),
      },
      authentication: t.field({}),
    }),
  });
