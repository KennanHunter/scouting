import { CodeHighlight } from "@mantine/code-highlight";
import {
  Box,
  Button,
  Center,
  Code,
  Flex,
  Select,
  Stack,
  Tabs,
  Title,
} from "@mantine/core";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";

const availableTargets = ["Raw Matches"] as const;
type AvailableTarget = (typeof availableTargets)[number];
export const ExportPage: FC = () => {
  const { id } = useParams();

  const [exportTarget, setExportTarget] =
    useState<AvailableTarget>("Raw Matches");

  return (
    <Stack>
      <Title>Export</Title>
      <Stack w={200}>
        <Select
          label={"Export Type"}
          data={availableTargets as any}
          value={exportTarget}
          onChange={(value) => {
            if (!value) return;
            if (!availableTargets.includes(value as any)) return;

            setExportTarget(value as AvailableTarget);
          }}
        />
      </Stack>
      <Tabs defaultValue={"download"}>
        <Tabs.List>
          <Tabs.Tab value="download">Download</Tabs.Tab>
          <Tabs.Tab value="python">Python</Tabs.Tab>
          <Tabs.Tab value="graphql">GraphIql</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="download">
          <Center>
            <Flex p={"md"} gap={"md"}>
              <Button
                component="a"
                download={true}
                href={`${import.meta.env.VITE_API_URI}/dump/2024mock/CSV/`}
              >
                CSV
              </Button>
              <Button
                component="a"
                download={true}
                href={`${import.meta.env.VITE_API_URI}/dump/2024mock/JSON/`}
              >
                JSON
              </Button>
            </Flex>
          </Center>
        </Tabs.Panel>

        <Tabs.Panel value="python" p={"md"}>
          Make sure you have the <Code>requests</Code> module.
          <Code block>python -m pip install requests</Code>
          Now that you have requests, you can use something like the following
          code
          <CodeHighlight
            p={"sm"}
            lang="python"
            code={`from io import StringIO
import requests
import csv

r = requests.get("${import.meta.env.VITE_API_URI}/dump/${id}/CSV/")

file = StringIO(r.text)

reader = csv.reader(file)

header = next(reader)

for row in reader:
  print(f"Row shows team {row[9]} in match {row[8]}")
`}
          />
        </Tabs.Panel>

        <Tabs.Panel value="graphql">
          <a
            href={`https://${import.meta.env.VITE_API_URI}/viewer/`}
            style={{ all: "unset" }}
          >
            <Button>Go to GraphIQL</Button>
          </a>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
