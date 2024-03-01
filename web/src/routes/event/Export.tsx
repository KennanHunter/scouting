import { CodeHighlight } from "@mantine/code-highlight";
import {
  Button,
  Center,
  Code,
  Flex,
  List,
  Select,
  Stack,
  Tabs,
  Title,
} from "@mantine/core";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";

const availableTargets = ["Raw Matches", "Match Schedule"] as const;
type AvailableTarget = (typeof availableTargets)[number];

const targetToURL = (
  target: AvailableTarget,
  eventId: string,
  format: "JSON" | "CSV"
) => {
  if (target === "Raw Matches") {
    return `${import.meta.env.VITE_API_URI}/dump/${eventId}/${format}/`;
  }
  if (target === "Match Schedule") {
    return `${import.meta.env.VITE_API_URI}/dump/schedule/${eventId}/${format}/`;
  }
  return "";
};

export const ExportPage: FC = () => {
  const { id } = useParams();

  const [exportTarget, setExportTarget] =
    useState<AvailableTarget>("Raw Matches");

  if (!id) return;

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
          <Tabs.Tab value="excel">Excel</Tabs.Tab>
          <Tabs.Tab value="python">Python</Tabs.Tab>
          <Tabs.Tab value="graphql">GraphIql</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="download">
          <Center>
            <Flex p={"md"} gap={"md"}>
              <Button
                component="a"
                download={true}
                href={targetToURL(exportTarget, id, "CSV")}
              >
                CSV
              </Button>
              <Button
                component="a"
                download={true}
                href={targetToURL(exportTarget, id, "JSON")}
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

r = requests.get(${targetToURL(exportTarget, id, "CSV")})

file = StringIO(r.text)

reader = csv.reader(file)

header = next(reader)

for row in reader:
  ${
    {
      "Raw Matches": `print(f"Row shows team {row[9]} in match {row[8]}")`,
      "Match Schedule": `print(f"Team {row[2]} appears in match {row[0]}")`,
    }[exportTarget]
  }`}
          />
        </Tabs.Panel>

        <Tabs.Panel value="graphql">
          <a
            href={`https://${import.meta.env.VITE_API_URI}/viewer/`}
            style={{ all: "unset" }}
          >
            <Button m={"md"}>Go to GraphIQL</Button>
          </a>
        </Tabs.Panel>

        <Tabs.Panel value="excel" p={"md"}>
          <List>
            <List.Item>Open Excel and navigate to the Data tab.</List.Item>
            <List.Item>
              Click From Web in the Get & Transform Data pane.
            </List.Item>
            <List.Item>
              Provide this URL:
              <a
                style={{ padding: "0 1ch" }}
                href={targetToURL(exportTarget, id, "CSV")}
              >
                {targetToURL(exportTarget, id, "CSV")}
              </a>
              and click Ok.
            </List.Item>
            <List.Item>
              Change File Origin to UTF-8 and click Transform Data.
            </List.Item>
            <List.Item>
              Once the window opens, click the Transform tab.
            </List.Item>
            <List.Item>Click Use First Row as Headers.</List.Item>
            <List.Item>
              Choose between Close & Load or Close & Load To.
            </List.Item>
          </List>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
