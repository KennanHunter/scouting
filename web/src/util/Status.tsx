import { Box, Loader, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { apiFetcher } from "../data/apiFetcher";
import { z } from "zod";

export const Status: FC = () => {
  const [status, setStatus] = useState<StatusEnum>();
  const [authenticated, setAuthenticated] = useState<string>();

  useEffect(() => {
    apiFetcher("/status/", statusResponse()).then((val) => {
      if (val.status === "error") return;

      setStatus(val.data.status.api);
      setAuthenticated(val.data.authentication);
    });
  }, []);

  if (!status || !authenticated) return <Loader />;

  return (
    <Box sx={() => ({ textAlign: "center" })}>
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
