import { Box, Paper, Text } from "@mantine/core";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Status } from "../util/Status";

export const Index: FC = () => {
  return (
    <Box
      style={(theme) => ({
        width: "100%",
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "5em auto",
        backgroundColor: theme.colors.dark[8],
      })}
    >
      <Paper
        withBorder
        style={() => ({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1em",
        })}
      >
        <Text>Indiana Scouting Alliance Explorer</Text>
        <Status />
      </Paper>
      <Box
        style={() => ({
          gridRow: "2 / 3",
        })}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
