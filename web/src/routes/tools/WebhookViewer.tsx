import { CodeHighlight } from "@mantine/code-highlight";
import { Box, Button, TextInput, Title } from "@mantine/core";
import { FC, useMemo, useState } from "react";

export const WebhookViewer: FC = () => {
  const [eventKey, setEventKey] = useState("2024mock");
  const data = useMemo(
    () => ({
      message_data: {
        event_name: "Mock Event",
        match: {
          comp_level: "f",
          match_number: 1,
          videos: [],
          time_string: "3:18 PM",
          set_number: 1,
          key: eventKey,
          time: 1397330280,
          score_breakdown: null,
          alliances: {
            blue: {
              score: 154,
              teams: ["frc9999", "frc9998", "frc9997"],
            },
            red: {
              score: 78,
              teams: ["frc9994", "frc9995", "frc9996"],
            },
          },
          event_key: eventKey,
        },
      },
      message_type: "match_score",
    }),
    [eventKey]
  );

  const [status, setStatus] = useState<undefined | number>();

  return (
    <Box>
      <Title>Webhook Viewer</Title>

      <TextInput
        onChange={(e) => setEventKey(e.target.value)}
        value={eventKey}
      />

      <CodeHighlight
        p={"sm"}
        lang={"JSON"}
        code={JSON.stringify(data, null, 4)}
      />

      <Button
        onClick={() => {
          fetch(`${import.meta.env.VITE_API_URI}/webhooks/tba`, {
            method: "POST",
            body: JSON.stringify(data),
          }).then((req) => {
            setStatus(req.status);
          });
        }}
      >
        Update Match Result
      </Button>

      {status && (
        <>
          <h1>Results</h1>
        </>
      )}
    </Box>
  );
};
