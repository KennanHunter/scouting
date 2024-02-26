import { Box, Divider, ScrollArea, Table, Text, Title } from "@mantine/core";
import { FC } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { z } from "zod";
import { apiClient } from "../../client";
import { extractTitleFromMatchKey } from "../../util/extractTitleFromMatchKey";

export const matchLoader = (async ({ params }) => {
  const match = await apiClient<{
    getMatch: {
      matchKey: string;
      startTime: number;
      matchEntries: {
        teamNumber: number;
        alliance: "red" | "blue";
        matchData: string | null;
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

  return match;
}) satisfies LoaderFunction;

const jsonData = z.record(z.string().or(z.number().or(z.boolean())).nullable());

export const MatchPage: FC = () => {
  const matchData = useLoaderData() as Awaited<ReturnType<typeof matchLoader>>;

  const matchEntriesWithData = matchData.matchEntries.filter(
    ({ matchData }) => matchData !== null
  );

  if (matchEntriesWithData.length === 0) return <>No match data yet</>;

  const keys = Object.keys(
    matchEntriesWithData.map((val) =>
      jsonData.parse(JSON.parse(val.matchData as string))
    )[0]
  );

  return (
    <Box>
      <Title style={{ overflow: "hidden" }}>
        {extractTitleFromMatchKey(matchData.matchKey)}
      </Title>
      <Divider py={"md"} />
      <ScrollArea>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          style={{
            overflowX: "scroll",
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Team Number</Table.Th>
              {keys.map((key) => (
                <Table.Td>{key}</Table.Td>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {matchEntriesWithData.map((row, index) => (
              <Table.Tr h={80} key={index}>
                <Table.Td>
                  <Text color={row.alliance}>{row.teamNumber}</Text>
                </Table.Td>
                {Object.values(
                  jsonData.parse(JSON.parse(row.matchData as string))
                ).map((entry) => (
                  <Table.Td>{entry?.toString() ?? ""}</Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
};
