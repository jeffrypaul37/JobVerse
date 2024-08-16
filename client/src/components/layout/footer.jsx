import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box p={4} mt="auto">
      <Flex justify="center" align="center">
        <Text>© 2024 Jobverse</Text>
        <Link to={"/contact-us"}>
          <Text paddingLeft={3} _hover={{ textDecoration: "underline" }}>
            Contact Us
          </Text>
        </Link>
        <Link to={"/faq"}>
          <Text paddingLeft={3} _hover={{ textDecoration: "underline" }}>
            FAQ
          </Text>
        </Link>
      </Flex>
    </Box>
  );
};

export default Footer;
