import { Button, Flex, Stack, Tabs, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconKey } from "@tabler/icons-react";
import { FC, useMemo, useState } from "react";
import { apiClient } from "../../client";
import { TabsOptions } from "./NewEventModal";

export const ImportEventModalTab: FC = () => {
  const [key, setKey] = useState<string>();
  const [error, setError] = useState<string>();

  const importEvent = useMemo(
    () => async () => {
      if (!key) {
        setError("Must define a key");
        return;
      }

      const response = await apiClient<{
        importEvent: { key: string };
      } | null>(`mutation { importEvent (id:"${key}") { key }}`);

      if (response && response.importEvent.key) {
        modals.closeAll();
        window.location.reload();
        return;
      }

      setError(
        "Unknown Error, ensure the key exists on TBA and is not already imported"
      );
    },
    [key, error, setError]
  );

  return (
    <Tabs.Panel value={TabsOptions.import}>
      <Stack>
        <TextInput
          label={"Event Key"}
          placeholder="2024inmis"
          error={error}
          value={key}
          onChange={(e) => {
            setError(undefined);
            setKey(e.target.value);
          }}
          leftSection={<IconKey />}
        />
        <Flex gap={"md"}>
          <Button onClick={() => importEvent()}>Import</Button>
          <Button onClick={() => modals.closeAll()}>Cancel</Button>
        </Flex>
      </Stack>
    </Tabs.Panel>
  );
};
