import { Center, Code, Stack, Text, Title } from "@mantine/core";
import { FC } from "react";
import { useRouteError } from "react-router-dom";

export const ErrorPage: FC = () => {
  const error = useRouteError();

  return (
    <Center>
      <Stack m={"2em"}>
        <Title>An error occured</Title>
        <Text size={"md"} c={"gray.6"}>
          Sorry {":("}
        </Text>
        <Text>
          Looks like either you got lost, or this route hasn't been programmed
          yet.
        </Text>
        <Text>
          If this is important, dm <Code>kennnan</Code> on discord and include
          the error below.
        </Text>
        <Code block>{JSON.stringify(error, null, 4)}</Code>
      </Stack>
    </Center>
  );
};
