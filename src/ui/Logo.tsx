import React, { memo } from "react";
import { Box, Text } from "ink";
import { Theme } from "./theme";

export const Logo = memo(function Logo() {
  return (
    <Box justifyContent="center" marginBottom={1}>
      <Text color={Theme.colors.dim}>self </Text>
      <Text color={Theme.colors.highlight} bold>config</Text>
    </Box>
  );
});

export default Logo;
