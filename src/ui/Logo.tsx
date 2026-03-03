import React, { memo } from "react";
import { Box } from "ink";
import BigText from "ink-big-text";
import Gradient from "ink-gradient";

const SUNSET_COLORS = ["#ff9966", "#ff5e62", "#ffa34e"];

export const Logo = memo(function Logo() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Gradient colors={SUNSET_COLORS}>
        <BigText text="self config" font="block" />
      </Gradient>
    </Box>
  );
});

export default Logo;
