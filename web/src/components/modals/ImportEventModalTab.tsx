import { Button, Flex, Stack, Tabs, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconKey } from "@tabler/icons-react";
import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      }>(`mutation { importEvent (id:"${key}") { key }}`);

      if (response.importEvent.key) {
        modals.closeAll();
      } else {
        setError("Unknown Error, ensure the key exists");
      }
    },
    [key]
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
