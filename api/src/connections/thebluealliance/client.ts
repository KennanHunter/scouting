import { Bindings } from "../..";

export const fetchTBA = async (
  path: string,
  key: Bindings["TBA_KEY"]
): Promise<unknown> => {
  console.log(key);

  return await fetch("https://www.thebluealliance.com/api/v3" + path, {
    headers: {
      "x-tba-auth-key": key,
    },
  }).then((val) => val.json());
};
