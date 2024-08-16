import React, { useState, useEffect } from 'react';
import {
  VStack,
  Text,
  Button,
  Input,
  Container,
  Box,
  Heading,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { fetchEvents } from '../recruiter/helper/eventApis';
import { applyForEvent } from './helper/eventsApi';

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const toast = useToast();  // Initialize the useToast hook

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventData = await fetchEvents(); // Fetch all events without any params
        setEvents(eventData);
        setFilteredEvents(eventData); // Initialize the filtered events with all events
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    loadData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = events.filter((event) =>
      event.eventName.toLowerCase().includes(query)
    );
    setFilteredEvents(filtered);
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await applyForEvent(eventId);
      toast({
        title: 'Joined successfully',
        description: 'You have successfully joined the event.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to join event:', error);
      toast({
        title: 'Error',
        description: 'You have already joined this event',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.lg" p={4}>
      <Heading as="h2" mb={5} size="xl" textAlign="center">
        View Events
      </Heading>
      <Input
        placeholder="Search by event name..."
        value={searchQuery}
        onChange={handleSearch}
        mb={5}
      />
      <Stack spacing={4}>
        {filteredEvents.map((event) => (
          <Box key={event._id} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
            <VStack align="flex-start" spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                {event.eventName}
              </Text>
              <Text>
                <strong>Location:</strong> {event.location}
              </Text>
              <Text>
                <strong>Description:</strong> {event.eventDescription}
              </Text>
              <Text>
                <strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}
              </Text>
              <Button
                colorScheme="teal"
                size="sm"
                alignSelf="flex-end"
                onClick={() => handleJoinEvent(event._id)}
              >
                Join
              </Button>
            </VStack>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default ViewEvents;
