import { Box, Flex, Paper, Stack } from "@mantine/core";
import { FC } from "react";
import { LoaderFunction, Outlet, useLoaderData } from "react-router-dom";
import { NavButton } from "../../components/NavButton";

export const eventLayoutLoader = (({ params }) => ({
  id: params.id as string,
})) satisfies LoaderFunction;

export const EventLayout: FC = () => {
  const { id } = useLoaderData() as ReturnType<typeof eventLayoutLoader>;
  const route = `/event/${id}/`;

  return (
    <Flex h={"100%"}>
      <Paper w={"15em"} h={"100%"} m={0} p={"1em"}>
        <Stack>
          <NavButton to={route}>Overview</NavButton>
          <NavButton to={route + "matches/"}>Matches</NavButton>
          <NavButton to={route + "teams/"}>Teams</NavButton>
          <NavButton to={route + "export/"}>Export</NavButton>
        </Stack>
      </Paper>
      <Box w={"100%"} p={"md"}>
        <Outlet />
      </Box>
    </Flex>
  );
};
