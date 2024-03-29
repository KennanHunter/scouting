import { Bindings } from "../..";

export const fetchTBA = async (
  path: string,
  key: Bindings["TBA_KEY"]
): Promise<unknown> => {
  if (!key) throw new Error("No Blue Alliance Key has been defined");

  console.log(`Querying ${path} with key: ${key}\nResults:`);

  return await fetch("https://www.thebluealliance.com/api/v3" + path, {
    headers: {
      "x-tba-auth-key": key,
    },
  }).then((val) => {
    if (!val.ok) throw new Error("TBA Error: " + val.statusText);

    return val.json();
  });
};
