import { Button } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export const NavButton: FC<PropsWithChildren<{ to: string }>> = ({
  children,
  to,
}) => {
  return (
    <Button variant="outline" component={Link} to={to}>
      {children}
    </Button>
  );
};
