import { typeAdder } from ".";
import {
  StatusEnum,
  checkAuthenticationStatus,
  checkDBConnection,
  checkTheBlueAllianceStatus,
} from "./status";
import { StatusType } from "./types";

export const addQuery: typeAdder = (schema) =>
  schema.queryType({
    fields: (t) => ({
      greet: t.string({
        args: {
          name: t.arg.string({
            required: false,
            defaultValue: "Kennan",
            description: "ti's the name",
          }),
        },
        resolve: (_source, { name }, context, _info) => {
          return `Hello ${name}`;
        },
      }),
      status: t.field({
        type: StatusType,
        resolve: async (_, {}, c) => ({
          status: {
            api: "operational" as StatusEnum,
            db: checkDBConnection(),
            thebluealliance: await checkTheBlueAllianceStatus(c),
          },
          authentication: await checkAuthenticationStatus(c),
          environment: Object.keys(c.env),
        }),
      }),
    }),
  });
