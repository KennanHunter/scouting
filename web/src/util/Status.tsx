import { Box, Loader, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { query } from "../client";

export const Status: FC = () => {
  const [status, _setStatus] = useState<unknown>();
  const [authenticated, _setAuthenticated] = useState<string>();
  console.log("Greeting")
  console.dir(query.greet({
    name: "Kennan :)"
  }))

  useEffect(() => {

    // apiFetcher("/status/", statusResponse()).then((val) => {
    //   if (val.status === "error") return;
    //   setStatus(val.data.status.api);
    //   setAuthenticated(val.data.authentication);
    // });
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
