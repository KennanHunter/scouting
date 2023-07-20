import { MediaQuery } from "@mantine/core";
import { FC, PropsWithChildren } from "react";

export const OnlyMobile: FC<PropsWithChildren> = ({ children }) => (
  <MediaQuery largerThan="sm" styles={{ display: "none" }}>
    <>{children}</>
  </MediaQuery>
);
