import { ActionIcon, Divider, Flex, Text, Title } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { LoaderFunction, useLoaderData } from "react-router-dom";

export const eventLoader = (({ params }) => {
  console.dir(params);

  return {
    id: params.id,
    name: "FIN Competition",
  };
}) satisfies LoaderFunction;

export const EventOverview = () => {
  const eventData = useLoaderData() as ReturnType<typeof eventLoader>;

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
