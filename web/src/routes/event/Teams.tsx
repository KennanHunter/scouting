import { Stack, Title } from "@mantine/core";
import { FC } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { apiClient } from "../../client";

export const teamsLoader = (async ({ params }) => {
  const teams = await apiClient<{
    getEvent: {
      teams: {
        teamNumber: number;
        nickname: string;
      }[];
    };
  }>(`{
    getEvent(key: "${params.id}") {
      teams {
        teamNumber
        nickname
      }
    }
  }`).then((val) => val.getEvent.teams);

  return teams;
}) satisfies LoaderFunction;

export const TeamsPage: FC = () => {
  const teamsData = useLoaderData() as Awaited<ReturnType<typeof teamsLoader>>;

  return (
    <>
      <Title>Teams</Title>
      <Stack>
        {teamsData.map((team) => (
          <>
            {team.teamNumber} - {team.nickname} <br />
          </>
        ))}
      </Stack>
    </>
  );
};
