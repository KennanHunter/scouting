import { Card, Chip, Flex, Stack, Text } from "@mantine/core";
import { FC } from "react";
import {
  Link,
  LoaderFunction,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { apiClient } from "../../client";
import { extractTitleFromMatchKey } from "../../util/extractTitleFromMatchKey";

export const matchesLoader = (async ({ params }) => {
  const matches = await apiClient<{
    getEvent: {
      key: string;
      matches: {
        matchKey: string;
        startTime: number;
        matchEntries: {
          teamNumber: number;
          alliance: "red" | "blue";
        }[];
      }[];
    };
  }>(`{
    getEvent(key: "${params.id}") {
      key
      matches {
        matchKey
        startTime
        matchEntries {
          teamNumber
          alliance
        }    
      }
    }
  }`).then((val) => val.getEvent);

  return matches;
}) satisfies LoaderFunction;

export const MatchesPage: FC = () => {
  const matchesData = useLoaderData() as Awaited<
    ReturnType<typeof matchesLoader>
  >;

  const navigate = useNavigate();

  return (
    <Stack>
      {matchesData.matches.map(
        ({ matchKey, startTime, matchEntries }, index) => (
          <Card
            component={Link}
            to={`/event/${matchesData.key}/matches/${matchKey}`}
            withBorder
            key={matchKey + index.toString()}
          >
            <Stack>
              <div>
                {extractTitleFromMatchKey(matchKey) +
                  " - " +
                  new Date(startTime).toUTCString()}
              </div>
              <Flex>
                {matchEntries
                  .filter((val) => val.alliance === "red")
                  .map(({ teamNumber }) => (
                    <Chip
                      onClick={() =>
                        navigate(
                          `/event/${matchesData.key}/teams/${teamNumber}`
                        )
                      }
                      variant="light"
                      checked={false}
                      color={"red"}
                    >
                      {teamNumber.toString()}
                    </Chip>
                  ))}
                <Text px={"md"}>/</Text>
                {matchEntries
                  .filter((val) => val.alliance === "blue")
                  .map(({ teamNumber }) => (
                    <Chip
                      onClick={() =>
                        navigate(
                          `/event/${matchesData.key}/teams/${teamNumber}`
                        )
                      }
                      variant="light"
                      checked={false}
                      color={"blue"}
                    >
                      {teamNumber.toString()}
                    </Chip>
                  ))}
              </Flex>
            </Stack>
          </Card>
        )
      )}
    </Stack>
  );
};
