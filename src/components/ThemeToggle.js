import React from "react";
import { Box, Button, Icon, useColorMode } from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box position={"absolute"} top={0} right={0}>
      <Button
        onClick={toggleColorMode}
        borderRadius={"full"}
        h={12}
        w={12}
        margin={4}
        padding={0}
      >
        <Icon as={colorMode === "light" ? MdDarkMode : MdLightMode} />
      </Button>
    </Box>
  );
};

export default ThemeToggle;
