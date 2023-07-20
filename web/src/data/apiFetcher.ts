import { GenerateResponseSchemaType } from "types/src/generateResponseSchema";
import { z } from "zod";

export const apiFetcher = <
  TSchema extends GenerateResponseSchemaType<z.AnyZodObject>,
>(
  path: string,
  schema: TSchema
): Promise<z.infer<TSchema>> =>
  fetch((import.meta.env.VITE_API_URI ?? "") + path, {
    headers: {
      Authorization: "Bearer " + import.meta.env.VITE_API_TOKEN,
      Accept: "application/json",
    },
  })
    .then((val) => val.json() as unknown)
    .then((val) => {
      const parsed = schema.safeParse(val);

      if (parsed.success) {
        return parsed.data;
      }

      const errorMessage = `Invalid response schema from server on ${path}, ${val.error.message}`;

      return {
        status: "error",
        error: { errorMessage },
      };
    })
    .then((val) => {
      if (val.status === "error") {
        console.log(`Error on ${path}: ${val.error.errorMessage}`);
      }

      return val;
    });
