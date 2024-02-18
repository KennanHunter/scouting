import { Bindings } from "../..";

export const fetchTBA = async (
  path: string,
  key: Bindings["TBA_KEY"]
): Promise<unknown> => {
  if (!key) throw new Error("No Blue Alliance Key has been defined");

  return await fetch("https://www.thebluealliance.com/api/v3" + path, {
    headers: {
      "x-tba-auth-key": key,
    },
  }).then((val) => {
    console.log(JSON.stringify(val, null, 4));

    if (!val.ok) throw new Error("TBA Error: " + val.statusText);

    return val.json();
  });
  // .then((data) => {
  //   console.log(`Querying ${path} with key: ${key}\nResults:`);
  //   console.log(data);

  //   return data;
  // });
};
