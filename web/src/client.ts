import { z } from "zod";

export const apiClient = <T>(gqlString: string): Promise<T> => {
  return fetch(import.meta.env.VITE_API_URI + "/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString,
    }),
  })
    .then((res) => res.json())
    .then((val) => {
      const parseResult = z.object({ data: z.unknown() }).safeParse(val);

      if (!parseResult.success) {
        throw new Error(parseResult.error.message);
      }

      return parseResult.data;
    })
    .then((val) => val.data as T);
};
