import { Button, Chip, FileButton, Stack, Text } from "@mantine/core";
import { FC, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { apiClient } from "../../client";

export const uploadLayoutLoader = (({ params }) => ({
  id: params.id as string,
})) satisfies LoaderFunction;

export const UploadPage: FC = () => {
  const { id } = useLoaderData() as ReturnType<typeof uploadLayoutLoader>;

  const [files, setFiles] = useState<File[]>([]);

  return (
    <>
      <Stack justify="center">
        <FileButton
          onChange={(file) => {
            if (!file) return;

            setFiles(files.concat(file));
          }}
          accept="image/png,image/jpeg"
        >
          {(props) => <Button {...props}>Add File</Button>}
        </FileButton>

        <Text>Current Files:</Text>
        {files.map((file) => (
          <Chip
            checked={false}
            onClick={() => {
              setFiles(
                files.filter((filterFile) => filterFile.name !== file.name)
              );
            }}
          >
            {file.name}
          </Chip>
        ))}

        <Button
          onClick={() => {
            files.map(async (file) => {
              const text = await file.text();

              // const data = JSON.parse(text) as {
              //   matchnumber: number;
              //   teamnumber: number;
              //   position: `${"Blue" | "Red"}${1 | 2 | 3}`;
              // };

              apiClient(
                `mutation { addMatchEntry(eventKey: ${id}, data: ${text}) { matchKey }}`
              );
            });
          }}
        >
          Upload
        </Button>
      </Stack>
    </>
  );
};
