import { z } from "zod";
import { RouteHandler } from "..";

const jsonData = z.record(z.string().or(z.number().or(z.null())));

export const dumpHandler: RouteHandler = async (c) => {
  const { eventId, format } = c.req.param();

  const query = c.env.DB.prepare(
    "SELECT * FROM TeamMatchEntry, Matches WHERE TeamMatchEntry.matchKey = Matches.matchKey AND Matches.eventKey = ?"
  ).bind(eventId);

  const { results } = await query.all();

  const rows = results.map((row) => {
    const matchDataObj = JSON.parse(row["matchData"] as any);

    const matchRow = {
      ...row,
      ...matchDataObj,
    };

    delete matchRow.matchData;

    return matchRow;
  });
  const date = new Date();

  const dateString = `scouting-export-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

  if (format === "JSON") {
    return c.body(JSON.stringify(rows, null, "\t"), 200, {
      "Content-Disposition": `attachment; filename="${dateString}.json"`,
    });
  }

  if (format === "CSV") {
    return c.body(
      [
        Object.keys(rows.at(0) ?? []).join(","),
        ...rows.map((row) => Object.values(row).join(",")),
      ].join("\n"),
      200,
      {
        "Content-Disposition": `attachment; filename="${dateString}.csv"`,
        "Content-Type": "text/csv",
      }
    );
  }

  return c.text("Please define a valid format", {
    status: 400,
  });
};
