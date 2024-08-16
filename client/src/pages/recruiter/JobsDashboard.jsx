import React, { useState, useEffect } from 'react';
import {
  Heading,
  useToast,
  Text,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Container,
  Box,
  Stack,
  useMediaQuery,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getUsername } from '../auth/helper/api';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { fetchJobs, deleteJob } from './helper/jobApis';

const JobsDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      const loadData = async () => {
        try {
          const username = await getUsername();
          const jobData = await fetchJobs(username.userId); // Fetch jobs using API function
          setJobs(jobData);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch jobs.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      };
      loadData();
    }
    else{
      navigate('/register')
    }

  }, [navigate, toast]);

  const handleDelete = async (job) => {
    if (job) {
      try {
        await deleteJob(job._id); // Use the API function to delete the job

        // Update UI directly by filtering out the deleted job
        setJobs(jobs.filter((j) => j._id !== job._id));

        toast({
          title: 'Success',
          description: 'Job deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete job.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Heading as="h2" mb={5} size="xl" textAlign="center">
        Jobs Dashboard
      </Heading>
      {jobs.length === 0 ? (
        <Center>
          <Text fontSize="lg" color="gray.500">
            No jobs available
          </Text>
        </Center>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple" size="sm" colorScheme="gray" spacing="1">
            <Thead>
              <Tr>
                <Th>Position</Th>
                <Th>Salary</Th>
                <Th>Available Positions</Th>
                <Th>Province</Th>
                <Th>Company</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {jobs.map((job) => (
                <Tr
                  key={job._id}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                  onClick={() => navigate(`/recruiter/job/${job._id}`)}
                >
                  <Td>{job.positionName}</Td>
                  <Td>{job.salary}</Td>
                  <Td>{job.positionsAvailable}</Td>
                  <Td>{job.location}</Td>
                  <Td>{job.companyName}</Td>
                  <Td>
                    <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                      <IconButton
                        icon={<EditIcon />}
                        aria-label="Edit Job"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation when clicking on buttons
                          navigate(`/recruiter/update-job/${job._id}`);
                        }}
                        size="sm"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete Job"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation when clicking on buttons
                          handleDelete(job);
                        }}
                        colorScheme="red"
                        size="sm"
                      />
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Container>
  );
};

export default JobsDashboard;
