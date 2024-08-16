import React, { useEffect, useState } from 'react';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    Textarea,
    Box,
    Heading,
    Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createEvent } from './helper/eventApis'; // Adjust the import path as needed
import { getRecruiterId } from './helper/jobApis';

function EventCreation() {
    const navigate = useNavigate();
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [location, setLocation] = useState('');

    const [eventNameError, setEventNameError] = useState('');
    const [eventDescriptionError, setEventDescriptionError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [dateError, setDateError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [recruiterId, setRecruiterId] = useState(null);

    useEffect(() => {
        const fetchRecruiterId = async () => {
            try {
                const userId = await getRecruiterId();
                setRecruiterId(userId);
            } catch (error) {
                console.error(error);
                navigate('/login'); // Redirect if token is not found
            }
        };

        fetchRecruiterId();
    }, [navigate]);
    const validateInputs = () => {
        let isValid = true;

        if (!eventName.trim()) {
            setEventNameError('Event name is required');
            isValid = false;
        } else {
            setEventNameError('');
        }

        if (!eventDescription.trim()) {
            setEventDescriptionError('Event description is required');
            isValid = false;
        } else {
            setEventDescriptionError('');
        }

        if (!location.trim()) {
            setLocationError('Location is required');
            isValid = false;
        } else {
            setLocationError('');
        }

        if (!date) {
            setDateError('Date is required');
            isValid = false;
        } else {
            setDateError('');
        }

        if (!time) {
            setTimeError('Time is required');
            isValid = false;
        } else {
            setTimeError('');
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return; // Do not submit if there are validation errors
        }

        try {
            const eventData = {
                eventName: eventName,
                eventDescription: eventDescription,
                dateTime: new Date(
                    `${date.toISOString().split('T')[0]}T${time.toTimeString().split(' ')[0]}Z`
                ),
                location: location,
                recruiterId: recruiterId
            };

            await createEvent(eventData);
            navigate('/recruiter/events-dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Heading as='h2' size='xl' align='center' mb='4' mt='4'>
                Create an Event
            </Heading>
            <Box maxWidth='600px' mx='auto' padding={'20px'}>
                <form onSubmit={handleSubmit}>
                    <FormControl isRequired isInvalid={!!eventNameError}>
                        <FormLabel>Event Name:</FormLabel>
                        <Input
                            type='text'
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                        <FormErrorMessage>{eventNameError}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!eventDescriptionError}>
                        <FormLabel>Event Description:</FormLabel>
                        <Textarea
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                        />
                        <FormErrorMessage>{eventDescriptionError}</FormErrorMessage>
                    </FormControl>

                    <Flex>
                        <FormControl isRequired isInvalid={!!dateError} mr='4'>
                            <FormLabel>Date:</FormLabel>
                            <DatePicker
                                selected={date}
                                onChange={(date) => setDate(date)}
                                dateFormat='yyyy-MM-dd'
                                customInput={<Input />}
                                minDate={new Date(Date.now() + 86400000)}
                            />
                            <FormErrorMessage>{dateError}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!timeError}>
                            <FormLabel>Time:</FormLabel>
                            <DatePicker
                                selected={time}
                                onChange={(time) => setTime(time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption='Time'
                                dateFormat='HH:mm'
                                customInput={<Input />}
                            />
                            <FormErrorMessage>{timeError}</FormErrorMessage>
                        </FormControl>
                    </Flex>

                    <FormControl isRequired isInvalid={!!locationError}>
                        <FormLabel>Location:</FormLabel>
                        <Input
                            type='text'
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <FormErrorMessage>{locationError}</FormErrorMessage>
                    </FormControl>

                    <Box maxWidth='100px' mx='auto' mt='4'>
                        <Button
                            colorScheme='teal'
                            type='submit'
                            isDisabled={!!eventNameError || !!eventDescriptionError || !!dateError || !!timeError || !!locationError}
                        >
                            Create Event
                        </Button>
                    </Box>
                </form>
            </Box>
        </>
    );
}

export default EventCreation;