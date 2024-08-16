import React, { useState } from "react";
import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { BsPerson } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validateName = (name) => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
      valid = false;
    } else if (!validateName(formData.name)) {
      newErrors.name = "Name should contain only letters and spaces";
      valid = false;
    }

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (formData.message.trim() === "") {
      newErrors.message = "Message is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form data:", formData);
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
      toast({
        title: "Message Sent.",
        description: "We will get back to you soon.",
        variant: "subtle",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        px={{ base: 4, md: 8 }}
      >
        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
          border="1px solid #E0E1E7"
          p={{ base: 4, md: 6 }}
          width={{ base: "full", md: "500px" }}
          maxW="800px"
        >
          <VStack spacing={5} align="start">
            <Heading as="h1" size="lg" textAlign="center">
              Contact Us!
            </Heading>
            <Text color="black" textAlign="center">
              Fill up the form below to contact us
            </Text>
            <FormControl id="name">
              <FormLabel>Your Name</FormLabel>
              <InputGroup borderColor="#E0E1E7">
                <InputLeftElement pointerEvents="none">
                  <BsPerson color="gray.800" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Name"
                  size="md"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </InputGroup>
              {errors.name && <Text color="red">{errors.name}</Text>}
            </FormControl>
            <FormControl id="email">
              <FormLabel>Your Email</FormLabel>
              <InputGroup borderColor="#E0E1E7">
                <InputLeftElement pointerEvents="none">
                  <MdOutlineEmail color="gray.800" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Email"
                  size="md"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />
              </InputGroup>
              {errors.email && <Text color="red">{errors.email}</Text>}
            </FormControl>
            <FormControl id="message">
              <FormLabel>Message</FormLabel>
              <Textarea
                borderColor="gray.300"
                placeholder="Enter your message here!"
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
              />
              {errors.message && <Text color="red">{errors.message}</Text>}
            </FormControl>
            <Button
              variant="solid"
              bg="#0D74FF"
              color="white"
              _hover={{ bg: "#0056b3" }}
              onClick={handleSubmit}
              alignSelf="center"
            >
              Send Message
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default Contact;
