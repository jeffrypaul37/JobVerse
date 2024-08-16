// UpdateJob.js

import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Textarea,
  Box,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById, updateJob } from './helper/jobApis'; // Import functions from jobApi.js

function UpdateJob() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get job ID from URL params
  const [positionName, setPositionName] = useState('');
  const [salary, setSalary] = useState('');
  const [numPositions, setNumPositions] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeRequired, setResumeRequired] = useState(false);
  const [coverLetterRequired, setCoverLetterRequired] = useState(false);
  const [location, setLocation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const toast = useToast(); // Initialize the toast hook

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
    'Yukon',
  ];

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const job = await fetchJobById(id);
        setPositionName(job.positionName);
        setSalary(job.salary.toString());
        setNumPositions(job.positionsAvailable.toString());
        setJobDescription(job.jobDescription);
        setResumeRequired(job.resumeRequired);
        setCoverLetterRequired(job.coverLetterRequired);
        setLocation(job.location); // Set new field
        setCompanyName(job.companyName || ''); // Set company name
      } catch (error) {
        console.error('Error fetching job details:', error);
        // Handle error states
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateJob(id, {
        positionName,
        salary: parseInt(salary),
        positionsAvailable: parseInt(numPositions),
        jobDescription,
        resumeRequired,
        coverLetterRequired,
        location, // Include updated field
        companyName, // Include company name
      });

      // Show success toast
      toast({
        title: 'Job updated successfully.',
        description: 'The job listing has been updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      // Navigate to the dashboard
      navigate(`/recruiter/dashboard`);
    } catch (error) {
      console.error('Error updating job listing:', error);

      // Show error toast
      toast({
        title: 'Error updating job listing.',
        description: 'There was an issue updating the job. Please try again later.',
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
        Update Job Listing
      </Heading>
      <Box maxWidth="600px" mx="auto">
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Company Name:</FormLabel>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Name of Position:</FormLabel>
            <Input
              type="text"
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Salary (in $):</FormLabel>
            <Input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Number of Positions:</FormLabel>
            <Input
              type="number"
              value={numPositions}
              onChange={(e) => setNumPositions(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Job Description and Details:</FormLabel>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Resume Required?</FormLabel>
            <Select
              id="resume"
              name="resume"
              value={resumeRequired}
              onChange={(e) => setResumeRequired(e.target.value === 'true')}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Cover Letter Required?</FormLabel>
            <Select
              id="cover"
              name="cover"
              value={coverLetterRequired}
              onChange={(e) => setCoverLetterRequired(e.target.value === 'true')}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Location:</FormLabel>
            <Select
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select a Province</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </Select>
          </FormControl>

          <Box maxWidth="100px" mx="auto">
            <Button colorScheme="teal" type="submit">
              Update Job
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default UpdateJob;
