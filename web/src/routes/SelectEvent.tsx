import { Button, Divider, Flex, SimpleGrid, Text } from "@mantine/core";
import { FC } from "react";
import { Link } from "react-router-dom";
import { EventCard } from "../components/EventCard";
import { openImportEventModal } from "../components/modals/ImportEvent";

export const selectEventLoader = () => {
  fetch("");
};

export const SelectEvent: FC = () => {
  return (
    <>
      <Flex align={"center"} justify={"space-between"}>
        <Text p="lg" pb={"sm"} size={"lg"}>
          Select an available event
        </Text>
        <Button color="green" onClick={openImportEventModal}>
          Import new event
        </Button>
      </Flex>
      <Divider py={"lg"} />
      <SimpleGrid cols={3}>
        {new Array(10).fill(
          <Link style={{ all: "unset" }} to="/event/2023inmis/">
            <EventCard
              currentlyActive={true}
              eventName={"FIN District Mishawaka Event"}
              eventKey={"2023inmis"}
              startDate={"Mar 3rd"}
            />
          </Link>
        )}
      </SimpleGrid>
    </>
  );
};
