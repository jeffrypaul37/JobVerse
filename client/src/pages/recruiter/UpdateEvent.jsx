/* Author: Ashish Kumar Guntipalli */

import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Box,
  Heading,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchEventById, updateEvent } from './helper/eventApis'; // Import functions from eventApis.js

function UpdateEvent() {
  const navigate = useNavigate();
  const { eventId } = useParams(); // Get event ID from URL params
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const toast = useToast(); // Initialize the toast hook

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const event = await fetchEventById(eventId);
        setEventName(event.eventName);
        setEventDescription(event.eventDescription);
        setDate(new Date(event.dateTime));
        setTime(new Date(event.dateTime));
        setLocation(event.location);
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch event details.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchEventDetails();
  }, [eventId, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(eventId, {
        eventName,
        eventDescription,
        dateTime: new Date(
          `${date.toISOString().split('T')[0]}T${time.toTimeString().split(' ')[0]}Z`
        ),
        location,
      });

      toast({
        title: 'Event updated successfully.',
        description: 'The event has been updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      navigate('/recruiter/events-dashboard'); // Redirect to dashboard after successful event update
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: 'There was an issue updating the event. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  return (
    <>
      <Heading as="h2" size="xl" align="center" mb="4">
        Update Event
      </Heading>
      <Box maxWidth="600px" mx="auto">
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Event Name:</FormLabel>
            <Input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Event Description:</FormLabel>
            <Textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </FormControl>

          <Flex>
            <FormControl isRequired mr="4">
              <FormLabel>Date:</FormLabel>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM-dd"
                minDate={new Date(Date.now() + 86400000)}
                customInput={<Input />}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Time:</FormLabel>
              <DatePicker
                selected={time}
                onChange={(time) => setTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm"
                minDate={new Date(Date.now() + 86400000)}
                customInput={<Input />}
              />
            </FormControl>
          </Flex>

          <FormControl isRequired>
            <FormLabel>Location:</FormLabel>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>

          <Box maxWidth="100px" mx="auto" mt="4">
            <Button colorScheme="teal" type="submit">
              Update Event
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default UpdateEvent;
