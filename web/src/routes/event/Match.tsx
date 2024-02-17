import { Box, Divider, Table, Text, Title } from "@mantine/core";
import { FC } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { z } from "zod";
import { apiClient } from "../../client";
import { extractTitleFromMatchKey } from "../../util/extractTitleFromMatchKey";

export const matchLoader = (async ({ params }) => {
  const matches = await apiClient<{
    getMatch: {
      matchKey: string;
      startTime: number;
      matchEntries: {
        teamNumber: number;
        alliance: "red" | "blue";
        matchData: string;
      }[];
    };
  }>(`{
    getMatch(key:"${params.matchId}") {
      matchKey
      startTime
      matchEntries {
        teamNumber
        alliance
        matchData
      }
    }
  }`).then((val) => val.getMatch);

  return matches;
}) satisfies LoaderFunction;
const jsonData = z.record(z.string().or(z.number().or(z.null())));

export const MatchPage: FC = () => {
  const matchData = useLoaderData() as Awaited<ReturnType<typeof matchLoader>>;

  const keys = Object.keys(
    matchData.matchEntries.map((val) =>
      jsonData.parse(JSON.parse(val.matchData))
    )[0]
  );

  console.dir(matchData.matchEntries);

  return (
    <Box
      style={{
        overflowX: "scroll",
      }}
    >
      <Title style={{ overflow: "hidden" }}>
        {extractTitleFromMatchKey(matchData.matchKey)}
      </Title>
      <Divider py={"md"} />
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Team Number</Table.Th>
            {keys.map((key) => (
              <Table.Td>{key}</Table.Td>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {matchData.matchEntries.map((row, index) => (
            <Table.Tr h={80} key={index}>
              <Table.Td>
                <Text color={row.alliance}>{row.teamNumber}</Text>
              </Table.Td>
              {Object.values(jsonData.parse(JSON.parse(row.matchData))).map(
                (entry) => (
                  <Table.Td>{entry?.toString() ?? ""}</Table.Td>
                )
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};
