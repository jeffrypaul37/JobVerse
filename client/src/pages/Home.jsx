import React from 'react';
import { Box, Flex, Text, Input, Button, Stack, Tooltip } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useJobSearchStore } from '../store/store';

const Home = () => {
  const jobTitle = useJobSearchStore((state) => state.jobTitle);
  const setJobTitle = useJobSearchStore((state) => state.setJobTitle);
  const navigate = useNavigate();

  // Check the role from localStorage
  const role = localStorage.getItem("role");
  console.log("User Role:", role); // Log the role for debugging

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <Box
      height="100vh"
      backgroundImage="url('https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
      backgroundSize="cover"
      backgroundPosition="center"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="white"
      px={4}
    >
      <Flex
        width={{ base: '100%', sm: '90%', md: '80%', lg: '70%' }}
        flexDirection={{ base: 'column', lg: 'row' }}
        alignItems="center"
        textAlign="center"
        backgroundColor="rgba(0, 0, 0, 0.4)"
        borderRadius="md"
        p={{ base: 4, sm: 6, md: 8 }}
        justifyContent="space-around"
      >
        <Box flex="1" marginRight={{ lg: "4" }}>
          <Text fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }} mb={4}>
            Are you a <Text as="span" color="green.400">candidate</Text> looking for your dream job?
          </Text>
          <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} mb={8}>
            Start your job search now!
          </Text>

          <Stack spacing={4} width="100%" maxWidth="600px" mb={8}>
            <Input
              placeholder="Position Name"
              backgroundColor="white"
              color="black"
              _focus={{ backgroundColor: 'white', boxShadow: 'outline' }}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <Button onClick={handleSearch} colorScheme="green" size="lg">Search</Button>
          </Stack>
        </Box>

        <Box flex="1" marginLeft={{ lg: "4" }}>
          <Text fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }} mb={4}>
            Are you an <Text as="span" color="orange">employer</Text> looking for the perfect candidate?
          </Text>
          <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} mb={8}>
            Post your job now!
          </Text>
          <Tooltip
            label="You need to be logged in as an employer to recruit."
            shouldWrapChildren
            isDisabled={role !== "Student"}
          >
            <Button
              as="a"
              href={role !== "Student" ? "/recruiter/dashboard" : undefined}
              colorScheme="orange"
              size="lg"
              isDisabled={role === "Student"} // Disable button if role is Student
              pointerEvents={role === "Student" ? "none" : "auto"} // Ensure button is non-clickable
            >
              I want to recruit now!
            </Button>
          </Tooltip>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
