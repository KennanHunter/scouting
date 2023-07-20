import { Box, Center, Paper, Text } from "@mantine/core";
import { FC } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { OnlyDesktop } from "../util/OnlyDesktop";
import { Status } from "../util/Status";
import { useMediaQueryConstants } from "../util/useMediaQueryConstants";

export const Index: FC = () => {
  const navigate = useNavigate();
  const { onlyMobile } = useMediaQueryConstants();

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "18em auto",
        gridTemplateRows: "5em auto",
        backgroundColor: theme.colors.dark[8],
      })}
    >
      <Paper
        shadow="lg"
        withBorder
        sx={() => ({
          gridColumn: "1 / 3",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1em",
        })}
      >
        <Text>Indiana Scouting Alliance Explorer</Text>
        <Status />
      </Paper>
      <OnlyDesktop>
        <Paper sx={() => ({ display: "flex", flexDirection: "column" })}>
          <Center h={"100%"}>Select an event</Center>
        </Paper>
      </OnlyDesktop>
      <Box
        sx={() => ({
          gridRow: "2 / 3",
          gridColumn: "2 / 3",
          [onlyMobile]: {
            gridColumn: "1 / 3",
          },
          padding: "1em",
        })}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
