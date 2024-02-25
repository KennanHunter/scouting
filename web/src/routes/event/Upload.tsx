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

  const [error, setError] = useState<string>();

  return (
    <>
      <Stack justify="center">
        <FileButton
          onChange={(file) => {
            if (!file) return;

            setFiles(files.concat(file));
          }}
        >
          {(props) => <Button {...props}>Add File</Button>}
        </FileButton>

        {files.length > 0 && <Text>Current Files:</Text>}

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
          disabled={!files.length}
          onClick={() => {
            setError("");

            Promise.all(
              files.map(async (file) => {
                const text = await file.text();

                try {
                  JSON.parse(text);
                } catch (error) {
                  setError(`File ${file.name} didn't produce safe JSON`);
                  return;
                }

                return apiClient(
                  `mutation { addMatchEntry(eventKey: ${id}, data: ${text}) { matchKey }}`
                )
                  .then((res) => {
                    const errors: { message: string } = (res as any)["errors"];

                    if (!(errors === undefined)) {
                      setError(error + "\n" + errors.message);
                      return;
                    }

                    setFiles(
                      files.filter(
                        (filterFile) => filterFile.name !== file.name
                      )
                    );
                  })
                  .catch((err) => {
                    setError(
                      error + "\nRequest failed: " + JSON.stringify(err)
                    );
                  });
              })
            );
          }}
        >
          Upload
        </Button>

        {error && <Text c={"red"}>{error}</Text>}
      </Stack>
    </>
  );
};
