import { z } from "zod";

// TODO: Better validation of api calls, maybe just actually switch to garph client
export const apiClient = async <T>(gqlString: string): Promise<T> => {
  const data = await fetch(import.meta.env.VITE_API_URI + "/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: gqlString,
    }),
  }).then((res) => res.json());

  const parseResult = z.object({ data: z.unknown() }).safeParse(data);

  if (!parseResult.success) {
    throw new Error(parseResult.error.message);
  }

  return parseResult.data.data as T;
};
