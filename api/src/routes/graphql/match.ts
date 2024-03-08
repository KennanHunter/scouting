import { g } from "garph";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { Resolvers } from ".";
import { dateType } from "./scalars";

export const allianceEnum = g.enumType("Alliance", ["red", "blue"]);

export const matchEntry = g.type("MatchEntry", {
  matchKey: g.string(),
  teamNumber: g.int(),
  alliance: allianceEnum,
  matchData: g
    .string()
    .optional()
    .description("JSON data containing reported information from scouters"),
});

export const matchType = g.type("Match", {
  matchKey: g.string(),
  matchNumber: g
    .int()
    .optional()
    .omitResolver()
    .description("Qualifier match number, returns zero for non-qualifiers"),
  startTime: g.ref(dateType).optional(),
  eventKey: g.string(),
  reportedWinningAlliance: g
    .string()
    .optional()
    .description("Winning alliance reported by The Blue Alliance"),
  reportedRedScore: g.int().optional().description("Red score reported by FMS"),
  reportedBlueScore: g
    .int()
    .optional()
    .description("Blue score reported by FMS"),
  matchEntries: g
    .ref(matchEntry)
    .list()
    .omitResolver()
    .description("Collected data for this match"),
});

export const databaseMatch = z.object({
  matchKey: z.string(),
  startTime: z.number().nullable(),
  eventKey: z.string(),
  reportedWinningAlliance: z.string().nullable(),
  reportedRedScore: z.number().nullable(),
  reportedBlueScore: z.number().nullable(),
});

export const databaseTeamMatchEntry = z.object({
  matchKey: z.string(),
  teamNumber: z.number(),
  alliance: z.string(),
  matchData: z.string().nullable(),
});

export const matchResolvers: Resolvers["Match"] = {
  matchEntries: async (parent, _args, context) => {
    const result = await context.env.DB.prepare(
      "SELECT * FROM TeamMatchEntry WHERE matchKey = ?"
    )
      .bind(parent.matchKey)
      .all();

    if (!result.success)
      throw new GraphQLError("Getting matches from D1 failed");

    return databaseTeamMatchEntry.array().parse(result.results);
  },
  matchNumber: async (parent) => {
    const subKey = parent.matchKey.split("_")[1];
    const isQualifier = subKey[0].toLowerCase() === "q";

    return isQualifier ? Number.parseInt(subKey.substring(2)) : 0;
  },
};
