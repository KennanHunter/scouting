import { z } from "zod";
import { RouteHandler } from "..";
import { matchDataSchema } from "../matchDataSchema";
import { convertEpochToExcel } from "../util/convertEpochToExcel";
import { extractMatchNumberFromKey } from "../util/extractMatchNumberFromKey";

const allianceType = z.literal("red").or(z.literal("blue"));

const teamMatchEntrySchema = z.object({
  matchKey: z.string(),
  teamNumber: z.number(),
  alliance: allianceType,
  matchData: z.string().optional().nullable(),
  startTime: z.number().nullable(),
  eventKey: z.string(),
  reportedWinningAlliance: allianceType.optional().nullable(),
  reportedRedScore: z.number().optional().nullable(),
  reportedBlueScore: z.number().optional().nullable(),
});
type TeamMatchEntrySchema = z.infer<typeof teamMatchEntrySchema>;

export const dumpHandler: RouteHandler = async (c) => {
  const { eventId, format } = c.req.param();

  const query =
    eventId !== "*"
      ? c.env.DB.prepare(
          "SELECT * FROM TeamMatchEntry, Matches WHERE TeamMatchEntry.matchKey = Matches.matchKey AND Matches.eventKey = ?"
        ).bind(eventId)
      : c.env.DB.prepare(
          "SELECT * FROM TeamMatchEntry, Matches WHERE TeamMatchEntry.matchKey = Matches.matchKey"
        );

  const { results } = await query.all();

  type MatchEntry = z.infer<typeof teamMatchEntrySchema> &
    z.infer<typeof matchDataSchema>;

  const matchEntries: (MatchEntry | TeamMatchEntrySchema)[] =
    teamMatchEntrySchema
      .array()
      .parse(results)
      .filter((row) => !!row.matchData)
      .map((row) => {
        if (!row["matchData"]) return row;

        const matchDataObj = matchDataSchema.parse(
          JSON.parse(row["matchData"])
        );

        const matchRow: MatchEntry | TeamMatchEntrySchema = {
          ...row,
          ...matchDataObj,
        };

        return matchRow;
      });

  const date = new Date();

  const dateString = `scouting-export-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

  if (format.toUpperCase() === "JSON") {
    return c.body(JSON.stringify(matchEntries, null, "\t"), 200, {
      "Content-Disposition": `attachment; filename="${dateString}.json"`,
    });
  }

  if (format.toUpperCase() === "CSV") {
    type AddedHeaderTypes = "teamOccurrence";
    const header = [
      "matchKey",
      "matchnumber",
      "alliance",
      "startTime",
      "eventKey",
      "reportedWinningAlliance",
      "reportedRedScore",
      "reportedBlueScore",
      "scoutname",
      "teamNumber",
      "teamOccurrence",
      "noshow",
      "autonote1",
      "autonote2",
      "autonote3",
      "autonote4",
      "autonote5",
      "autonote6",
      "autonote7",
      "autonote8",
      "startingpos",
      "autoamp",
      "autospeaker",
      "leave",
      "teleopamp",
      "teleopspeaker",
      "shotfromsubwoofer",
      "shotfrompodium",
      "shotfromwing",
      "shotfromoutside",
      "teleoptrap",
      "amplifications",
      "passednotes",
      "climbtime",
      "onstageorder",
      "harmonizeqty",
      "buddy",
      "spotlit",
      "floorpickup",
      "sourcepickup",
      "understage",
      "playeddefense",
      "receiveddefense",
      "died",
      "tipped",
      "broke",
      "rating",
      "comments",
      "stolennotes",
    ] as (keyof MatchEntry | AddedHeaderTypes)[];

    // Keep a running tally of the occurrence of the team within our dataset
    const teamOccurrenceLookup: Map<number, number> = new Map();

    const rows = (
      matchEntries.sort((a, b) => {
        return (
          extractMatchNumberFromKey(a.matchKey) -
          extractMatchNumberFromKey(b.matchKey)
        );
      }) as (MatchEntry | TeamMatchEntrySchema)[]
    ).map((row) => {
      const columnValues = header.map((columnLabel) => {
        if (!row) throw new Error("empty row not filtered out");

        const columnValue = row[columnLabel as keyof typeof row];

        if (columnLabel === "startTime") {
          const startTime = columnValue as (typeof row)["startTime"];

          return convertEpochToExcel(startTime ?? 0);
        }

        if (columnLabel === "teamOccurrence") {
          if (!teamOccurrenceLookup.has(row.teamNumber)) {
            teamOccurrenceLookup.set(row.teamNumber, 1);

            return teamOccurrenceLookup.get(row.teamNumber);
          }

          teamOccurrenceLookup.set(
            row.teamNumber,
            (teamOccurrenceLookup.get(row.teamNumber) as number) + 1
          );

          return teamOccurrenceLookup.get(row.teamNumber) ?? 1;
        }

        return columnValue;
      });

      return columnValues.map(escapeValue).join(",");
    });

    const finalCSVText = [header.map(escapeValue).join(","), ...rows].join(
      "\n"
    );

    return c.body(finalCSVText, 200, {
      "Content-Disposition": `attachment; filename="${dateString}.csv"`,
      "Content-Type": "text/csv",
    });
  }

  return c.text("Please define a valid format", {
    status: 400,
  });
};

const escapeValue: (
  value: number | string | boolean | null | undefined
) => string = (val) => {
  if (typeof val === "boolean") return (val ? 1 : 0).toString();

  if (typeof val === "number") return val.toString();

  if (typeof val === "string") return `"${val.toString()?.replace('"', '""')}"`;

  return "";
};
