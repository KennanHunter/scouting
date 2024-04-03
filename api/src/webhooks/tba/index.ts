import { z } from "zod";
import { RouteHandler } from "../..";
import { TBAMatchSchema } from "../../connections/thebluealliance/type/matchSchema";

const messageSchema = z.object({
  message_type: z.literal("upcoming_match").or(z.literal("match_score")),
  message_data: z.unknown(),
});

const matchScoreSchema = z.object({
  event_name: z.string(),
  match: TBAMatchSchema,
});

export const TBAWebhookHandler: RouteHandler = async (c) => {
  console.log(
    JSON.stringify({
      TBAWebhook: {
        json: await c.req.json(),
      },
    })
  );

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
      "INSERT OR REPLACE INTO Matches (matchKey, reportedWinningAlliance, reportedRedScore, reportedBlueScore) VALUES (?, ?, ?);"
    ).bind(
      matchScoreData.match.key,
      matchScoreData.match.winningAlliance || null,
      matchScoreData.match.alliances.red,
      matchScoreData.match.alliances.blue
    );
  }
};
