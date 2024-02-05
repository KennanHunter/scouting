import { Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconKey } from "@tabler/icons-react";
import { FC } from "react";
import { create } from "zustand";
import { apiClient } from "../../client";

const useImportEventKeyStore = create<{
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

const ImportEventModal: FC<{ errors?: string[] }> = ({ errors }) => {
  const { key, setKey } = useImportEventKeyStore();

  return (
    <Stack>
      <TextInput
        label={"Event Key"}
        placeholder="2024inmis"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        error={errors ? errors.join(" ") : undefined}
        leftSection={<IconKey />}
      />
    </Stack>
  );
};

export const openImportEventModal = () => {
  return modals.openConfirmModal({
    title: "Import a new Event",
    children: <ImportEventModal />,
    labels: { confirm: "Import", cancel: "Cancel" },
    onConfirm: async () => {
      const key = useImportEventKeyStore.getState().key;

      const { importEvent } = await apiClient<{
        importEvent: { key: string };
      }>(`mutation {
        importEvent (id:"${key}") {
          key
        }
      }`);

      useImportEventKeyStore.getState().clear();
    },
  });
};
