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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getUsername } from '../auth/helper/api';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { fetchEvents, deleteEvent, fetchApplicantsByEventId } from './helper/eventApis';

const EventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      const loadData = async () => {
        try {
          const username = await getUsername();
          const eventData = await fetchEvents(username.userId); // Fetch events using API function
          setEvents(eventData);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch events.',
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

  const handleDelete = async (event) => {
    if (event) {
      try {
        await deleteEvent(event._id); // Use the API function to delete the event

        // Update UI directly by filtering out the deleted event
        setEvents(events.filter((e) => e._id !== event._id));

        toast({
          title: 'Success',
          description: 'Event deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete event.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleViewApplicants = async (eventId) => {
    try {
      const applicantsData = await fetchApplicantsByEventId(eventId); // Fetch applicants using API function
      setApplicants(applicantsData);
      setSelectedEventId(eventId);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'Failed to fetch applicants.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setApplicants([]);
    setSelectedEventId(null);
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Heading as="h2" mb={5} size="xl" textAlign="center">
        Events Dashboard
      </Heading>
      {events.length === 0 ? (
        <Center>
          <Text fontSize="lg" color="gray.500">
            No events available
          </Text>
        </Center>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple" size="sm" colorScheme="gray" spacing="1">
            <Thead>
              <Tr>
                <Th>Event Name</Th>
                <Th>Description</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Location</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map((event) => (
                <Tr
                  key={event._id}
                >
                  <Td>{event.eventName}</Td>
                  <Td>{event.eventDescription}</Td>
                  <Td>{new Date(event.dateTime).toLocaleDateString()}</Td>
                  <Td>{new Date(event.dateTime).toLocaleTimeString()}</Td>
                  <Td>{event.location}</Td>
                  <Td>
                    <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                      <IconButton
                        icon={<EditIcon />}
                        aria-label="Edit Event"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/recruiter/update-event/${event._id}`);
                        }}
                        size="sm"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete Event"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation when clicking on buttons
                          handleDelete(event);
                        }}
                        colorScheme="red"
                        size="sm"
                      />
                      <IconButton
                        icon={<ViewIcon />}
                        aria-label="View Applicants"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation when clicking on buttons
                          handleViewApplicants(event._id);
                        }}
                        colorScheme="blue"
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

      <Modal isOpen={isModalOpen} onClose={closeModal} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Applicants for Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {applicants.length === 0 ? (
              <Text>No applicants available for this event.</Text>
            ) : (
              <Table variant="simple" size="sm" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {applicants.map((applicant) => (
                    <Tr key={applicant.email}>
                      <Td>{applicant.name}</Td>
                      <Td>{applicant.email}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default EventsDashboard;
