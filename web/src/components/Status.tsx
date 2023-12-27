import { Box, Loader, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { apiClient } from "../client";

export const Status: FC = () => {
  const [status, _setStatus] = useState<unknown>();
  const [authenticated, _setAuthenticated] = useState<string>();
  const query = apiClient.useQuery();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URI}/graphql/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "{ greet }",
      }),
    })
      .then((val) => val.json())
      .then(console.dir);
  }, []);

  if (!status || !authenticated) return <Loader />;

  return (
    <Box style={() => ({ textAlign: "center" })}>
      {status === "offline" ? (
        <Text color="red">API Offline</Text>
      ) : (
        <Text color="green">API Operational</Text>
      )}

      {authenticated === "invalid" ? (
        <Text color="red">Unauthenticated</Text>
      ) : (
        <Text color="green">Authenticated</Text>
      )}
    </Box>
  );
};
