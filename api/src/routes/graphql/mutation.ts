// cspell:disable

import { g } from "garph";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { Resolvers } from ".";
import { fetchTBA } from "../../connections/thebluealliance/client";
import { TBAEventSchema } from "../../connections/thebluealliance/type/eventSchema";
import { TBAMatchSchema } from "../../connections/thebluealliance/type/matchSchema";
import { TBATeamSchema } from "../../connections/thebluealliance/type/teamSchema";
import { matchDataSchema } from "../../matchDataSchema";
import { eventType } from "./event";
import { matchEntry } from "./match";
import { dateType } from "./scalars";

export const mutationType = g.type("Mutation", {
  importEvent: g
    .ref(eventType)
    .args({
      id: g.string(),
    })
    .description("Importing latest events"),
  createEvent: g
    .ref(eventType)
    .args({
      event: g.inputType("EventInput", {
        key: g.string(),
        name: g.string(),
        startTime: g.ref(dateType),
      }),
      teams: g.int().list(),
    })
    .description("Create the event raw"),
  addMatchEntry: g.ref(matchEntry).args({
    eventKey: g.string(),
    data: g.string(),
  }),
});

export const mutationResolvers: Resolvers["Mutation"] = {
  createEvent: async (_, { event, teams }, context) => {
    const eventInsert = context.env.DB.prepare(
      "INSERT OR REPLACE INTO Events (eventKey, eventName, startTime) VALUES (?, ?, ?)"
    )
      .bind(event.key, event.name, event.startTime.getTime())
      .run()
      .catch((err) => {
        console.error(err);
        throw new GraphQLError("Event creation error");
      });

    await eventInsert;

    const teamTBAData = teams.map((team) =>
      fetchTBA(`/team/frc${team}`, context.env.TBA_KEY)
    );

    const teamInserts = (await Promise.all(teamTBAData))
      .map((teamData) => TBATeamSchema.parse(teamData))
      .map((team) => [
        context.env.DB.prepare(
          "INSERT OR REPLACE INTO Teams (teamNumber, teamName, nickname) VALUES (?, ?, ?)"
        ).bind(team.team_number, team.name, team.nickname ?? team.name),
        context.env.DB.prepare(
          "INSERT OR REPLACE INTO TeamEventAppearance (eventKey, teamNumber) VALUES (?, ?)"
        ).bind(event.key, team.team_number),
      ])
      .flat();

    const teamInsertsSucceeded = (
      await context.env.DB.batch(teamInserts)
    ).every((result) => result.success);

    if (!teamInsertsSucceeded) throw new GraphQLError("Inserts failed");

    return {
      key: event.key,
      name: event.name,
      startTime: new Date(event.startTime),
    };
  },
  importEvent: async (_, { id }, context) => {
    const data = TBAEventSchema.safeParse(
      await fetchTBA(`/event/${id}`, context.env.TBA_KEY)
    );

    if (!data.success)
      throw new GraphQLError("Invalid Data Received from The Blue Alliance");

    const event = data.data;
    const startTime = new Date(event.start_date).getTime();

    context.env.DB.prepare(
      "INSERT INTO Events (eventKey, eventName, startTime) VALUES (?, ?, ?)"
    )
      .bind(event.key, event.name, startTime)
      .run();

    const teams = TBATeamSchema.array().parse(
      await fetchTBA(`/event/${id}/teams/simple`, context.env.TBA_KEY)
    );

    await context.env.DB.batch(
      teams
        .map((team) => [
          context.env.DB.prepare(
            "INSERT OR IGNORE INTO Teams (teamNumber, teamName, nickname) VALUES (?, ?, ?) "
          ).bind(team.team_number, team.name, team.nickname ?? team.name),
          context.env.DB.prepare(
            "INSERT OR IGNORE INTO TeamEventAppearance (eventKey, teamNumber) VALUES (?, ?)"
          ).bind(event.key, team.team_number),
        ])
        .flat()
    );

    const matches = TBAMatchSchema.array().parse(
      await fetchTBA(`/event/${id}/matches/simple`, context.env.TBA_KEY)
    );

    await context.env.DB.batch(
      matches
        .map((match) => {
          const createMatch = context.env.DB.prepare(
            "INSERT INTO Matches (matchKey, startTime, eventKey, reportedWinningAlliance, reportedRedScore, reportedBlueScore) \
          VALUES (?, ?, ?, ?, ?, ?)"
          ).bind(
            match.key,
            match.time,
            match.event_key,
            match.winningAlliance ? match.winningAlliance : null,
            match.alliances.red.score ?? null,
            match.alliances.blue.score ?? null
          );

          const createTeamMatchConnections = (["red", "blue"] as const)
            .map((alliance) =>
              (match.alliances[alliance].team_keys ?? [])
                .map((teamKey) => Number.parseInt(teamKey.substring(3)))
                .map((teamNumber) =>
                  context.env.DB.prepare(
                    "INSERT OR IGNORE INTO TeamMatchEntry (matchKey, teamNumber, alliance, matchData) \
                  VALUES (?, ?, ?, ?)"
                  ).bind(match.key, teamNumber, alliance, null)
                )
            )
            .flat();

          return [createMatch, ...createTeamMatchConnections];
        })
        .flat()
    );

    return {
      key: event.key,
      name: event.name,
      startTime: new Date(startTime),
    };
  },
  addMatchEntry: async (_, { data, eventKey }, context) => {
    try {
      JSON.parse(data);
    } catch {
      throw new GraphQLError("Improperly formatted JSON data");
    }

    const matchDataResult = matchDataSchema.safeParse(JSON.parse(data));

    if (!matchDataResult.success)
      throw new GraphQLError("The schema is incorrect");

    if (!matchDataResult.data.position)
      throw new GraphQLError("Scouter position can not be null, call Kennan");

    if (!matchDataResult.data.teamnumber)
      throw new GraphQLError("Team number can not be null, call Kennan");

    const matchEntry = {
      matchKey: `${eventKey}_qm${matchDataResult.data.matchnumber}`,
      matchData: data,
      alliance: z
        .literal("red")
        .or(z.literal("blue"))
        .parse(matchDataResult.data.position.slice(0, -1).toLowerCase()),
      teamNumber: matchDataResult.data.teamnumber,
    };

    const team = await fetchTBA(
      `/team/frc${matchDataResult.data.teamnumber}`,
      context.env.TBA_KEY
    ).then((val) => TBATeamSchema.parse(val));

    context.env.DB.batch([
      context.env.DB.prepare(
        "INSERT OR IGNORE INTO Teams (teamNumber, teamName, nickname) VALUES (?, ?, ?) "
      ).bind(matchEntry.teamNumber, team.name, team.nickname ?? team.name),
      context.env.DB.prepare(
        "INSERT OR IGNORE INTO TeamEventAppearance (eventKey, teamNumber) VALUES (?, ?)"
      ).bind(eventKey, team.team_number),
    ]);

    const matchDataParseResult = matchDataSchema.safeParse(
      JSON.parse(matchEntry.matchData)
    );

    if (!matchDataParseResult.success)
      throw new GraphQLError("Unrecognized data");

    context.env.DB.batch([
      context.env.DB.prepare(
        "INSERT OR IGNORE INTO Matches \
      (matchKey, eventKey) \
      VALUES (?, ?)"
      ).bind(matchEntry.matchKey, eventKey),
      context.env.DB.prepare(
        "INSERT OR REPLACE INTO TeamMatchEntry \
      (matchKey, teamNumber, alliance, matchData)\
      VALUES (?, ?, ?, ?)"
      ).bind(
        matchEntry.matchKey,
        matchEntry.teamNumber,
        matchEntry.alliance,
        JSON.stringify(matchDataParseResult.data)
      ),
    ]);

    return matchEntry;
  },
};
