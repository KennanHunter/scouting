import { g } from "garph";
import { GraphQLError } from "graphql";
import { Resolvers } from ".";
import { fetchTBA } from "../../connections/thebluealliance/client";
import { TBAEventSchema } from "../../connections/thebluealliance/type/eventSchema";
import { TBATeamSchema } from "../../connections/thebluealliance/type/teamSchema";
import { eventType } from "./event";

export const mutationType = g.type("Mutation", {
  importEvent: g
    .ref(eventType)
    .args({
      id: g.string(),
    })
    .description("Importing latest events"),
});

export const mutationResolvers: Resolvers["Mutation"] = {
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
          ).bind(team.team_number, team.name, team.name ?? team.nickname),
          context.env.DB.prepare(
            "INSERT OR IGNORE INTO TeamEventAppearance (eventKey, teamNumber) VALUES (?, ?)"
          ).bind(event.key, team.team_number),
        ])
        .flat()
    );

    // TODO: Fix as any
    return {
      key: event.key,
      name: event.name,
      startTime: new Date(startTime),
      teams: teams.map((team) => ({
        teamName: team.name,
        nickname: team.nickname ?? "",
        teamNumber: team.team_number,
      })),
    };
  },
};
