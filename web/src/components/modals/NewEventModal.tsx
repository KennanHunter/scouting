import { Tabs } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconDatabaseImport, IconEdit } from "@tabler/icons-react";
import { FC, useState } from "react";
import { CreateEventModalTab } from "./CreateEventModalTab";
import { ImportEventModalTab } from "./ImportEventModalTab";

export const TabsOptions = {
  import: "import",
  create: "create",
} as const;
type TabsOption = (typeof TabsOptions)[keyof typeof TabsOptions];

const NewEventModal: FC = () => {
  const [activeTab, setActiveTab] = useState<TabsOption>(TabsOptions.import);

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

      <ImportEventModalTab />
      <CreateEventModalTab />
    </Tabs>
  );
};

export const openNewEventModal = () => {
  return modals.open({
    title: "Import a new Event",
    children: <NewEventModal />,
  });
};
