/* Jayrajsinh Mahavirsinh Jadeja */

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  useToast,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { fetchApplicationsByEmail } from "./helper/jobApis";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/fetch.hook";

const Applications = () => {
  // State for storing applications data
  const [applications, setApplications] = useState([]);
  // State for handling loading status
  const [loading, setLoading] = useState(true);
  // Chakra UI Toast hook for displaying messages
  const toast = useToast();
  // Hook for navigation
  const navigate = useNavigate();
  // Custom hook for fetching user data
  const [{ isLoading, apiData, serverError }] = useFetch();

  // Responsive heading and table sizes based on viewport
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });
  const tableSize = useBreakpointValue({ base: "sm", md: "md" });

  useEffect(() => {
    const loadApplications = async () => {
      // Check if apiData or email is missing
      if (!apiData || !apiData.email) {
        return;
      }
      try {
        // Fetch applications based on user email
        const userEmail = apiData.email;
        const data = await fetchApplicationsByEmail(userEmail);
        setApplications(data);
      } catch (error) {
        console.log(error);
        // Display error toast if fetching fails
        toast({
          title: "Error",
          description: "Failed to load applications.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        // Set loading to false once data is fetched or an error occurs
        setLoading(false);
      }
    };

    loadApplications();
  }, [apiData, toast]);

  // Display spinner while data is loading
  if (isLoading || loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={6} maxW="full" overflowX="auto">
      <Heading as="h1" size={headingSize} mb={4}>
        My Applications
      </Heading>
      <Button colorScheme="teal" mb={4} onClick={() => navigate("/search")}>
        Search for New Jobs
      </Button>
      {/* Display message if no applications are present */}
      {applications.length === 0 ? (
        <Text fontSize="lg" color="gray.500">
          No applications made
        </Text>
      ) : (
        <Table variant="striped" size={tableSize}>
          <Thead>
            <Tr>
              <Th>Job Title</Th>
              <Th>Company</Th>
              <Th>Status</Th>
              <Th>Resume</Th>
              <Th>Cover Letter</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* Map through applications and display them */}
            {applications.map((application) => (
              <Tr key={application._id}>
                <Td>{application.jobId.positionName}</Td>
                <Td>{application.jobId.companyName}</Td>
                <Td>{application.status || "Pending"}</Td>
                <Td>
                  {application.resume ? (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    "No Resume"
                  )}
                </Td>
                <Td>
                  {application.coverLetter ? (
                    <a
                      href={application.coverLetter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Cover Letter
                    </a>
                  ) : (
                    "No Cover Letter"
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default Applications;
