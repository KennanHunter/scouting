// cspell:disable

import { Infer, g } from "garph";
import { GraphQLError } from "graphql";
import { Resolvers } from ".";
import { fetchTBA } from "../../connections/thebluealliance/client";
import { TBAEventSchema } from "../../connections/thebluealliance/type/eventSchema";
import { TBATeamSchema } from "../../connections/thebluealliance/type/teamSchema";
import { eventType } from "./event";
import { matchEntry, matchType } from "./match";
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

    return {
      key: event.key,
      name: event.name,
      startTime: new Date(startTime),
    };
  },
  addMatchEntry: async (_, { data, eventKey }, context) => {
    const matchData = JSON.parse(data) as unknown as {
      matchnumber: number;
      teamnumber: number;
      position: `${"Blue" | "Red"}${1 | 2 | 3}`;
    };

    const matchEntry = {
      matchKey: `${eventKey}_qm${matchData.matchnumber}`,
      matchData: data,
      alliance: matchData.position.slice(0, -1).toLowerCase() as "blue" | "red",
      teamNumber: matchData.teamnumber,
    };

    const team = await fetchTBA(
      `/team/frc${matchData.teamnumber}`,
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

    await context.env.DB.prepare(
      "INSERT OR REPLACE INTO TeamMatchEntry \
      (matchKey, teamNumber, alliance, matchData)\
      VALUES (?, ?, ?, ?)"
    )
      .bind(
        matchEntry.matchKey,
        matchEntry.teamNumber,
        matchEntry.alliance,
        matchEntry.matchData
      )
      .run();

    return matchEntry;
  },
};
