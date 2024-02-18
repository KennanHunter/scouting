import { Button, Flex, Stack, Tabs, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconDatabaseImport, IconEdit, IconKey } from "@tabler/icons-react";
import { FC, useState } from "react";
import { create } from "zustand";
import { apiClient } from "../../client";

const useImportConfirmStore = create<{
  key: string;
  setKey: (val: string) => void;
  clear: () => void;
}>()((set) => ({
  key: "",
  setKey: (val) => {
    set({ key: val });
  },
  clear: () => {
    set({ key: "" });
  },
}));

const TabsOptions = {
  import: "import",
  create: "create",
} as const;
type TabsOption = (typeof TabsOptions)[keyof typeof TabsOptions];

const ImportEventModal: FC<{ errors?: string[] }> = ({ errors }) => {
  const { key, setKey } = useImportConfirmStore();
  const [activeTab, setActiveTab] = useState<TabsOption>(TabsOptions.import);
  const form = useForm({
    initialValues: {
      eventName: "",
      teams: "",
    },
  });

  return (
    <Tabs
      defaultValue={TabsOptions.import}
      value={activeTab}
      onChange={(val) => setActiveTab(val as TabsOption)}
    >
      <Tabs.List>
        <Tabs.Tab
          value={TabsOptions.import}
          leftSection={<IconDatabaseImport />}
        >
          Import
        </Tabs.Tab>
        <Tabs.Tab value={TabsOptions.create} leftSection={<IconEdit />}>
          Create
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={TabsOptions.import}>
        <Stack>
          <TextInput
            label={"Event Key"}
            placeholder="2024inmis"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            error={errors ? errors.join(" ") : undefined}
            leftSection={<IconKey />}
          />
          <Flex gap={"md"}>
            <Button
              onClick={() => {
                apiClient<{
                  importEvent: { key: string };
                }>(`mutation { importEvent (id:"${key}") { key }}`);
              }}
            >
              Import
            </Button>
            <Button onClick={() => modals.closeAll()}>Cancel</Button>
          </Flex>
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value={TabsOptions.create}>
        <Stack>
          <TextInput
            {...form.getInputProps("eventName")}
            label={"Event Name"}
            placeholder="2024 Center Grove Scrimmage"
          />
          <TextInput
            label={"Teams (separate with spaces)"}
            {...form.getInputProps("teams")}
            placeholder="3494 254"
          />
          <Flex gap={"md"}>
            <Button
              onClick={() => {
                apiClient<{
                  createEvent: { key: string };
                }>(`mutation {
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
                }`).then(() => modals.closeAll());
              }}
            >
              Create
            </Button>
            <Button onClick={() => modals.closeAll()}>Cancel</Button>
          </Flex>
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
};

export const openImportEventModal = () => {
  return modals.open({
    title: "Import a new Event",
    children: <ImportEventModal />,
  });
};
