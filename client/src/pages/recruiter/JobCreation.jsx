/* Author: Ashish Kumar Guntipalli */

import React, { useState, useEffect } from 'react';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    Select,
    Textarea,
    Box,
    Heading,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { createJob, getRecruiterId } from './helper/jobApis'; // Adjust the import path as needed

function JobCreation() {
    const navigate = useNavigate();
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [numPositions, setNumPositions] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [resumeRequired, setResumeRequired] = useState('true');
    const [coverLetterRequired, setCoverLetterRequired] = useState('false');
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [salaryError, setSalaryError] = useState('');
    const [numPositionsError, setNumPositionsError] = useState('');
    const [recruiterId, setRecruiterId] = useState(null);

    // List of Canadian provinces
    const provinces = [
        'Alberta',
        'British Columbia',
        'Manitoba',
        'New Brunswick',
        'Newfoundland and Labrador',
        'Northwest Territories',
        'Nova Scotia',
        'Nunavut',
        'Ontario',
        'Prince Edward Island',
        'Quebec',
        'Saskatchewan',
        'Yukon'
    ];

    const validateInputs = () => {
        let isValid = true;

        if (!/^\d*$/.test(salary)) {
            setSalaryError('Salary must be a number');
            isValid = false;
        } else {
            setSalaryError('');
        }

        if (!/^\d*$/.test(numPositions)) {
            setNumPositionsError('Number of Positions must be a number');
            isValid = false;
        } else {
            setNumPositionsError('');
        }

        return isValid;
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!validateInputs()) {
            return; // Do not submit if there are validation errors
        }

        try {
            const jobData = {
                positionName: position,
                salary: parseInt(salary),
                positionsAvailable: parseInt(numPositions),
                jobDescription: jobDescription,
                resumeRequired: resumeRequired === 'true',
                coverLetterRequired: coverLetterRequired === 'true',
                recruiterId: recruiterId, // Attach recruiterId to the job
                companyName: companyName, // Attach companyName to the job
                location: location, // Attach location to the job
            };

            await createJob(jobData, token);
            navigate('/recruiter/dashboard'); // Redirect to dashboard after successful job creation
        } catch (error) {
            console.error(error);
            // Handle error states (e.g., show error message to user)
        }
    };

    return (
        <>
            <Heading as='h2' size='xl' align='center' mb='4'>
                Create a Job Listing
            </Heading>
            <Box maxWidth='600px' mx='auto'>
                <form onSubmit={handleSubmit}>
                    <FormControl isRequired>
                        <FormLabel>Name of Position:</FormLabel>
                        <Input
                            type='text'
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </FormControl>

                    <FormControl isRequired isInvalid={!!salaryError}>
                        <FormLabel>Salary (in $):</FormLabel>
                        <Input
                            type='text' // Use text to handle non-numeric input and validation
                            value={salary}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSalary(value);
                                if (!/^\d*$/.test(value)) {
                                    setSalaryError('Salary must be a number');
                                } else {
                                    setSalaryError('');
                                }
                            }}
                        />
                        <FormErrorMessage>{salaryError}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!numPositionsError}>
                        <FormLabel>Number of Positions:</FormLabel>
                        <Input
                            type='text' // Use text to handle non-numeric input and validation
                            value={numPositions}
                            onChange={(e) => {
                                const value = e.target.value;
                                setNumPositions(value);
                                if (!/^\d*$/.test(value)) {
                                    setNumPositionsError('Number of Positions must be a number');
                                } else {
                                    setNumPositionsError('');
                                }
                            }}
                        />
                        <FormErrorMessage>{numPositionsError}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Job Description and Details:</FormLabel>
                        <Textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Company Name:</FormLabel>
                        <Input
                            type='text'
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Location:</FormLabel>
                        <Select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value='' disabled>Select a province</option>
                            {provinces.map((province) => (
                                <option key={province} value={province}>
                                    {province}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Cover Letter Required?</FormLabel>
                        <Select
                            id='cover'
                            name='cover'
                            value={coverLetterRequired}
                            onChange={(e) => setCoverLetterRequired(e.target.value)}
                        >
                            <option value='true'>Yes</option>
                            <option value='false'>No</option>
                        </Select>
                    </FormControl>

                    <Box maxWidth='100px' mx='auto' mt='4'>
                        <Button
                            colorScheme='teal'
                            type='submit'
                            isDisabled={!!salaryError || !!numPositionsError}
                        >
                            Create Job
                        </Button>
                    </Box>
                </form>
            </Box>
        </>
    );
}

export default JobCreation;
