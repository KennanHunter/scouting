import { Box, Flex, Grid, Paper, Stack } from "@mantine/core";
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
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "15em auto",
        gridTemplateRows: "auto",
        width: "100%",
        height: "100%",
      }}
    >
      <Paper w={"15em"} h={"100%"} m={0} p={"1em"}>
        <Stack>
          <NavButton to={route}>Overview</NavButton>
          <NavButton to={route + "matches/"}>Matches</NavButton>
          <NavButton to={route + "teams/"}>Teams</NavButton>
          <NavButton to={route + "export/"}>Export</NavButton>
          <NavButton to={route + "upload/"}>Upload</NavButton>
        </Stack>
      </Paper>
      <Box w={"100%"} p={"md"}>
        <Outlet />
      </Box>
    </Box>
  );
};
