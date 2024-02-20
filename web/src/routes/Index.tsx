import { Box, Paper, Text } from "@mantine/core";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";

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
          overflow: "hidden",
        })}
      >
        <Link style={{ all: "unset" }} to={"/"}>
          <Text p="lg">Indiana Scouting Alliance Explorer</Text>
        </Link>
        {/* <Status /> */}
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
