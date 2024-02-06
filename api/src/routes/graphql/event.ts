import { Infer, g } from "garph";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { Resolvers } from ".";
import { matchType } from "./match";
import { dateType } from "./scalars";
import { teamType, teamTypeZodSchema } from "./team";

export const eventType = g
  .type("Event", {
    key: g.string(),
    name: g.string(),
    startTime: g
      .ref(dateType)
      .description("UTC Timestamp of day of competition"),
    teams: g.ref(teamType).list().omitResolver(),
    matches: g.ref(matchType).list().omitResolver(),
  })
  .description("An FRC Event");

const matchEntryJoinResult = z.object({
  matchKey: z.string(),
  startTime: z.number(),
  eventKey: z.string(),
  teamNumber: z.number(),
  alliance: z.string(),
  matchData: z.string(),
});

export const eventResolvers: Resolvers["Event"] = {
  teams: async (parent, _args, context, info) => {
    const teams = (
      await context.env.DB.prepare(
        "SELECT * FROM TeamEventAppearance, Teams WHERE Teams.teamNumber = TeamEventAppearance.teamNumber AND eventKey = ?"
      )
        .bind(parent.key)
        .all()
    ).results;

    return teamTypeZodSchema.array().parse(teams);
  },
  matches: async (parent, _args, context, info) => {
    const matchEntryParseResult = matchEntryJoinResult.array().safeParse(
      await context.env.DB.prepare(
        "SELECT * FROM Matches INNER JOIN TeamMatchEntry ON TeamMatchEntry.matchKey = Matches.matchKey WHERE Matches.eventKey = ?"
      )
        .bind(parent.key)
        .all()
        .then((result) => result.results)
    );

    if (!matchEntryParseResult.success)
      throw new GraphQLError("Failed join :(");

    const matches = matchEntryParseResult.data.reduce<
      Infer<typeof matchType>[]
    >((prev, cur) => {
      const index = prev.findIndex((val) => val.eventKey == cur.matchKey);

      if (index === -1) {
        prev.push({
          matchKey: cur.matchKey,
          startTime: cur.startTime,
          eventKey: cur.eventKey,
          matchEntries: [
            {
              alliance: cur.alliance,
              matchData: cur.matchData,
              matchKey: cur.matchKey,
              teamNumber: cur.teamNumber,
            },
          ],
        });
      } else {
        prev.at(index)?.matchEntries.push({
          alliance: cur.alliance,
          matchData: cur.matchData,
          matchKey: cur.matchKey,
          teamNumber: cur.teamNumber,
        });
      }

      return prev;
    }, []);

    return matches;
  },
};
