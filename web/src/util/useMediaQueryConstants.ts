import { useMantineTheme } from "@mantine/core";

export const useMediaQueryConstants = () => {
  const theme = useMantineTheme();

  return {
    onlyMobile: `@media (max-width: ${theme.breakpoints.sm})` as const,
    onlyDesktop: `@media (min-width: ${theme.breakpoints.sm})` as const,
  };
};
