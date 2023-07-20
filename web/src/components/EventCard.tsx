import { Badge, Flex, Group, Paper, Text } from "@mantine/core";
import { FC } from "react";

export const EventCard: FC<{
  eventName: string;
  eventKey: string;
  startDate: string;
  currentlyActive: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}> = ({ eventKey, eventName, startDate, currentlyActive, onClick }) => {
  return (
    <Paper p={"lg"} onClick={onClick}>
      <Group align="center">
        <Text size={"lg"}>{eventName}</Text>
      </Group>
      {currentlyActive ? (
        <Badge my="sm" color="green" variant="filled">
          Active
        </Badge>
      ) : (
        <></>
      )}
      <Flex justify={"space-between"} wrap={"wrap"}>
        <Text size={"md"} c={"gray.6"}>
          {eventKey}
        </Text>
        <Text size={"md"} c={"gray.6"}>
          {startDate}
        </Text>
      </Flex>
    </Paper>
  );
};
