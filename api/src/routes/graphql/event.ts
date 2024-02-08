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
    matches: g.ref(matchType).list().omitResolver().args({
      teamNumber: g.int().optional(),
    }),
  })
  .description("An FRC Event");

const matchEntryJoinResult = z.object({
  matchKey: z.string(),
  startTime: z.number(),
  eventKey: z.string(),
  teamNumber: z.number(),
  alliance: z.literal("red").or(z.literal("blue")),
  matchData: z.string(),
});

export const eventResolvers: Resolvers["Event"] = {
  teams: async (parent, _args, context) => {
    const teamsQuery = await context.env.DB.prepare(
      "SELECT * FROM TeamEventAppearance, Teams WHERE Teams.teamNumber = TeamEventAppearance.teamNumber AND eventKey = ?"
    )
      .bind(parent.key)
      .all();

    if (!teamsQuery.success)
      throw new GraphQLError(teamsQuery.error || "Something broke");

    return teamTypeZodSchema.array().parse(teamsQuery.results);
  },
  matches: async (parent, { teamNumber }, context) => {
    const queryWithTeamNumber = context.env.DB.prepare(
      "SELECT * FROM Matches INNER JOIN TeamMatchEntry ON TeamMatchEntry.matchKey = Matches.matchKey WHERE Matches.eventKey = ? AND TeamMatchEntry.teamNumber = ?"
    ).bind(parent.key, teamNumber ?? 0);

    const queryWithout = context.env.DB.prepare(
      "SELECT * FROM Matches INNER JOIN TeamMatchEntry ON TeamMatchEntry.matchKey = Matches.matchKey WHERE Matches.eventKey = ?"
    ).bind(parent.key);

    const matchEntryParseResult = matchEntryJoinResult
      .array()
      .safeParse(
        await (teamNumber ? queryWithTeamNumber : queryWithout)
          .all()
          .then((result) => result.results)
      );

    if (!matchEntryParseResult.success)
      throw new GraphQLError("Failed join :(");

    const matches = matchEntryParseResult.data.reduce<
      Infer<typeof matchType>[]
    >((prev, cur) => {
      const index = prev.findIndex((val) => val.matchKey === cur.matchKey);

      if (index === -1) {
        prev.push({
          matchKey: cur.matchKey,
          startTime: new Date(cur.startTime),
          eventKey: cur.eventKey,
          matchEntries: [cur],
        });
      } else {
        prev.at(index)?.matchEntries.push(cur);
      }

      return prev;
    }, []);

    return matches;
  },
};
