import { InferClient, createClient } from "@garph/gqty";
import {
  createScalarsEnumsHash,
  createGeneratedSchema,
} from "@garph/gqty/dist/utils";
import { schema, queryType } from "api/src/routes/graphql/index";

type ClientTypes = InferClient<{ query: typeof queryType }>;

export const apiClient = createClient<ClientTypes>({
  generatedSchema: createGeneratedSchema(schema),
  scalarsEnumsHash: createScalarsEnumsHash(schema),
  url: `${import.meta.env.VITE_API_URI}/graphql/`,
});

// Needed for the babel plugin
// export { schema as compiledSchema };

// TODO: replace runtime issues with https://garph.dev/docs/integration/client/gqty.html#babel-plugin
