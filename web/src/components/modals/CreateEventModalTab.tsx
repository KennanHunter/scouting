import { Button, Flex, Stack, Tabs, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { FC } from "react";
import { apiClient } from "../../client";
import { TabsOptions } from "./NewEventModal";

export const CreateEventModalTab: FC = () => {
  const form = useForm({
    initialValues: {
      eventName: "",
      teams: "",
    },
  });

  const createEventGQL = `mutation {
    createEvent(
      event: {
        key: "2024local_${Math.round(Math.random() * 10000)}", 
        name: "${form.values.eventName}", 
        startTime: ${new Date().getTime()},
      }
      teams: [${form.values.teams.split(" ").join(",")}]
    ) {
      key
    }
  }`;

  return (
    <Tabs.Panel value={TabsOptions.create}>
      <Stack>
        <TextInput
          label={"Event Name"}
          placeholder="2024 Center Grove Scrimmage"
          {...form.getInputProps("eventName")}
        />
        <TextInput
          label={"Teams (separate with spaces)"}
          placeholder="3494 254"
          {...form.getInputProps("teams")}
        />
        <Flex gap={"md"}>
          <Button
            onClick={async () => {
              await apiClient(createEventGQL);

              modals.closeAll();
            }}
          >
            Create
          </Button>
          <Button onClick={() => modals.closeAll()}>Cancel</Button>
        </Flex>
      </Stack>
    </Tabs.Panel>
  );
};
