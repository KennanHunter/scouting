import { APIContext } from "../..";
import { fetchTBA } from "./client";
import { TBAEventResponseSchema, TBATeamSchema } from "./schema";

export const importEvent = async (c: APIContext, eventCode: string) => {
  const event = await fetchTBA(`/event/${eventCode}/`, eventCode).then((val) =>
    TBAEventResponseSchema().parse(val)
  );

  c.env.DB.prepare(
    "INSERT INTO Events (eventKey, eventName) VALUES (?, ?)"
  ).bind(event.key, event.name);

  const teams = await fetchTBA(
    `/event/${eventCode}/teams/simple`,
    eventCode
  ).then((val) => TBATeamSchema().array().parse(val));

  const inserts = await c.env.DB.batch(
    teams.map((team) =>
      c.env.DB.prepare(
        "INSERT INTO Teams (teamKey, teamNumber, nickname) VALUES (?, ?, ?)"
      ).bind(team.key, team.team_number, team.nickname ?? team.name)
    )
  );
};

export const importEventSchedule = async (
  c: APIContext,
  eventCode: string
) => {};
