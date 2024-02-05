import { Button, Divider, Flex, SimpleGrid, Text } from "@mantine/core";
import { FC } from "react";
import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import { EventCard } from "../components/EventCard";
import { openImportEventModal } from "../components/modals/ImportEvent";
import { apiClient } from "../client";

export const selectEventLoader = (async () => {
  const data = await apiClient<{
    allEvents: {
      name: string;
      startTime: number;
      key: string;
    }[];
  }>(`{
    allEvents {
      name,
      startTime,
      key
    }
  }`);

  return data.allEvents;
}) satisfies LoaderFunction;

export const SelectEvent: FC = () => {
  const eventsData = useLoaderData() as Awaited<
    ReturnType<typeof selectEventLoader>
  >;

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
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 5 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
        px={"sm"}
      >
        {eventsData.map((event) => (
          <Link
            style={{ all: "unset" }}
            key={event.key}
            to={`/event/${event.key}/`}
          >
            <EventCard
              currentlyActive={true}
              eventName={event.name}
              eventKey={event.key}
              startDate={new Date(event.startTime).toLocaleDateString()}
            />
          </Link>
        ))}
      </SimpleGrid>
    </>
  );
};
