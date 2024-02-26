import { z } from "zod";
import { RouteHandler } from "..";
import { convertEpochToExcel } from "../util/convertEpochToExcel";

export const dumpScheduleHandler: RouteHandler = async (c) => {
  const { eventId, format } = c.req.param();

  const { results, success } = await c.env.DB.prepare(
    "SELECT Matches.matchKey, teamNumber, alliance FROM Matches, TeamMatchEntry WHERE Matches.eventKey = ? AND TeamMatchEntry.matchKey = Matches.matchKey"
  )
    .bind(eventId)
    .all();

  if (!success) return c.text("Database Error :(, call Kennan", 400);

  const matches = z
    .object({
      matchKey: z.string(),
      teamNumber: z.number(),
      alliance: z.literal("red").or(z.literal("blue")).optional(),
      startTime: z.number().optional(),
    })
    .array()
    .parse(results)
    .reduce(
      (prev, { startTime, matchKey, teamNumber, alliance }) => {
        if (!alliance) return prev;

        if (!prev[matchKey]) {
          prev[matchKey] = {
            blue: [],
            red: [],
          };
        }

        if (startTime) prev[matchKey]["startTime"] = startTime;

        const teamList = prev[matchKey][alliance];

        teamList.push(teamNumber);

        return prev;
      },
      {} as Record<
        string,
        {
          startTime?: number;
          blue: number[];
          red: number[];
        }
      >
    );

  const date = new Date();
  const dateString = `scouting-match-schedule-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

  if (format.toUpperCase() === "JSON") {
    return c.body(JSON.stringify(matches, null, "\t"), 200, {
      "Content-Disposition": `attachment; filename="${dateString}.json"`,
    });
  }

  if (format.toUpperCase() === "CSV") {
    const header = [
      "matchKey",
      "startTime",
      "red1",
      "red2",
      "red3",
      "blue1",
      "blue2",
      "blue3",
    ].join(",");

    const rows = Object.entries(matches).map(
      ([matchKey, { startTime, red, blue }]) =>
        [
          matchKey,
          startTime ? convertEpochToExcel(startTime) : "",
          red.at(0),
          red.at(1),
          red.at(2),
          blue.at(0),
          blue.at(1),
          blue.at(2),
        ]
          .map((item) => (item ? item.toString() : ""))
          .join(",")
    );

    return c.text([header, ...rows].join("\n"), 200, {
      "Content-Disposition": `attachment; filename="${dateString}.csv"`,
    });
  }

  c.text("Please specify a format", 401);
};
