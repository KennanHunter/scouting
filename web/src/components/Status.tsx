import { Box, Loader, Text } from "@mantine/core";
import { FC, useState } from "react";

export const Status: FC = () => {
  const [status, _setStatus] = useState<unknown>();
  const [authenticated, _setAuthenticated] = useState<string>();

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
