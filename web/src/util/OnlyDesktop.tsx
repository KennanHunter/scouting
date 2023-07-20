import { MediaQuery } from "@mantine/core";
import { FC, PropsWithChildren } from "react";

export const OnlyDesktop: FC<
  PropsWithChildren<{
    override?: boolean;
  }>
> = ({ children, override }) => {
  if (override === true) {
    return <>children</>;
  }
  if (override === false) {
    return <></>;
  }

  return (
    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      {children}
    </MediaQuery>
  );
};
