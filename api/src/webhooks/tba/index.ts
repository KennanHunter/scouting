import { z } from "zod";
import { RouteHandler } from "../..";

const messageSchema = z.object({
  message_type: z.literal("upcoming_match").or(z.literal("match_score")),
  message_data: z.unknown(),
});

const matchScoreSchema = z.object({
  event_name: z.string(),
  match: z.object({
    comp_level: z.string(),
    match_number: z.number(),
    time_string: z.string(),
    set_number: z.number(),
    key: z.string(),
    time: z.number(),
    winningAlliance: z.literal("red").or(z.literal("blue")).or(z.literal("")),
    score_breakdown: z.unknown(),
    alliances: z.object({
      blue: z.object({
        score: z.number(),
        teams: z.string().array(),
      }),
      red: z.object({
        score: z.number(),
        teams: z.string().array(),
      }),
    }),
    event_key: z.string(),
  }),
});

export const TBAWebhookHandler: RouteHandler = async (c) => {
  const hash = c.req.header("X-TBA-HMAC");

  if (!hash) return c.text("Please attach header", 401);

  // TODO: Actually validate the hash instead of being a lazy piece of shit

  const data = await c.req.json();

  const messageParseResult = messageSchema.safeParse(data);

  if (!messageParseResult.success) {
    return c.text("Unrecognized Webhook schema", 400);
  }

  const messageData = messageParseResult.data.message_data;

  if (messageParseResult.data.message_type === "match_score") {
    const matchScoreData = matchScoreSchema.parse(messageData);

    const eventExists = await c.env.DB.prepare(
      "SELECT EXISTS(SELECT 1 FROM Events WHERE eventKey = ?)"
    )
      .bind(matchScoreData.match.event_key)
      .first()
      .then((val) => {
        console.log(JSON.stringify(val, null, 4));

        return z.number().parse(val);
      })
      .then((val) => val === 1);

    if (!eventExists) return c.text("Event not being tracked", 404);

    c.env.DB.prepare(
      "INSERT INTO Matches (reportedWinningAlliance, reportedRedScore, reportedBlueScore) VALUES (?, ?, ?);"
    ).bind(
      matchScoreData.match.winningAlliance ?? null,
      matchScoreData.match.alliances.red,
      matchScoreData.match.alliances.blue
    );
  }
};
