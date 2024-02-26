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
  matchData: g.string().optional(),
});

export const matchType = g.type("Match", {
  matchKey: g.string(),
  startTime: g.ref(dateType).optional(),
  eventKey: g.string(),
  reportedWinningAlliance: g.string().optional(),
  reportedRedScore: g.int().optional(),
  reportedBlueScore: g.int().optional(),
  matchEntries: g.ref(matchEntry).list().omitResolver(),
});

export const databaseMatch = z.object({
  matchKey: z.string(),
  startTime: z.number(),
  eventKey: z.string(),
  reportedWinningAlliance: z.string().optional(),
  reportedRedScore: z.number().optional(),
  reportedBlueScore: z.number().optional(),
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

    console.log(JSON.stringify(result.results, null, 4));

    return databaseTeamMatchEntry.array().parse(result.results);
  },
};
