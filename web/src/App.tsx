import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { FC } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Event } from "./routes/Event";
import { Index } from "./routes/Index";
import { SelectEvent } from "./routes/SelectEvent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "select/",
        element: <SelectEvent />,
      },
      {
        path: "event/:id/",
        element: <Event />,
      },
    ],
  },
]);

export const App: FC = () => (
  <>
    <MantineProvider
      theme={{
        colorScheme: "dark",
        primaryColor: "green",
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications />
      <ModalsProvider
        modalProps={{
          size: "xl",
        }}
      >
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </>
);
