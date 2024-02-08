import { ActionIcon, Divider, Flex, Text, Title } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { apiClient } from "../../client";

export const eventLoader = (async ({ params }) => {
  const data = await apiClient<{
    getEvent: { name: string; startTime: number };
  }>(`{
    getEvent(key: "${params.id}") {
      name
      startTime
    }
  }`);

  return {
    id: params.id,
    name: data.getEvent.name,
  };
}) satisfies LoaderFunction;

export const EventOverview = () => {
  const eventData = useLoaderData() as Awaited<ReturnType<typeof eventLoader>>;

  return (
    <>
      <Flex justify={"space-between"} align={"center"}>
        <div>
          <Title>{eventData.name}</Title>
          <Text size={"md"} c={"gray.6"}>
            {eventData.id}
          </Text>
        </div>
        <div>
          <ActionIcon>
            <IconDotsVertical />
          </ActionIcon>
        </div>
      </Flex>
      <Divider py={"lg"} />
    </>
  );
};
