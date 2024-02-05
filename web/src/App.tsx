import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { FC } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Index } from "./routes/Index";
import { SelectEvent, selectEventLoader } from "./routes/SelectEvent";
import { EventOverview, eventLoader } from "./routes/event/Index";
import { EventLayout, eventLayoutLoader } from "./routes/event/Layout";
import { ErrorPage } from "./routes/special/Error";
import { TeamsPage, teamsLoader } from "./routes/event/Teams";
import { ExportPage } from "./routes/event/Export";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <SelectEvent />,
        loader: selectEventLoader,
      },
      {
        path: "event/:id/",
        element: <EventLayout />,
        loader: eventLayoutLoader,
        children: [
          {
            path: "",
            element: <EventOverview />,
            loader: eventLoader,
          },
          {
            path: "teams/",
            element: <TeamsPage />,
            loader: teamsLoader,
          },
          {
            path: "export/",
            element: <ExportPage />,
          },
        ],
      },
    ],
  },
]);

const theme = createTheme({
  primaryColor: "green",
});

export const App: FC = () => (
  <>
    <MantineProvider theme={theme} defaultColorScheme="dark">
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
