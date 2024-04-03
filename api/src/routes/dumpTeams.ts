import { z } from "zod";
import { RouteHandler } from "..";
import { teamTypeZodSchema } from "./graphql/team";

export const dumpTeamsHandler: RouteHandler = async (c) => {
  const { eventId, format } = c.req.param();

  const rows = await c.env.DB.prepare(
    "SELECT * FROM TeamEventAppearance, Teams WHERE TeamEventAppearance.eventKey = ? \
    AND Teams.teamNumber = TeamEventAppearance.teamNumber"
  )
    .bind(eventId)
    .all()
    .then((val) => val.results);

  const teams = teamTypeZodSchema.array().parse(rows);

  const date = new Date();
  const dateString = `scouting-teams-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

  if (format.toLocaleLowerCase() === "csv") {
    const headers = ["teamNumber", "nickname", "teamName"] as (keyof z.infer<
      typeof teamTypeZodSchema
    >)[];

    const rows = [
      headers,
      ...teams.map(({ teamNumber, teamName, nickname }) =>
        [teamNumber, nickname, teamName]
          .map((value) =>
            typeof value === "string"
              ? `"` + value.replaceAll(`"`, `""`) + `"`
              : value
          )
          .join(",")
      ),
    ];

    return c.text(rows.join("\n"), 200, {
      "Content-Disposition": `attachment; filename="${dateString}.csv"`,
    });
  }

  if (format.toLowerCase() === "json") {
    return c.body(JSON.stringify(teams, null, "\t"), 200, {
      "Content-Disposition": `attachment; filename="${dateString}.json"`,
    });
  }
};
