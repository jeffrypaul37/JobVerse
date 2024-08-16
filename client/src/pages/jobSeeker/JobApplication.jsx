/* Jayrajsinh Mahavirsinh Jadeja */

import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
  useBreakpointValue,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { applyForJob, fetchJobById } from "./helper/jobApis";
import useFetch from "../../hooks/fetch.hook";

const JobApplication = () => {
  // Extract jobId from route parameters
  const { jobId } = useParams();
  // State for storing resume and cover letter files
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  // State for handling form validation
  const [resumeRequired, setResumeRequired] = useState(false);
  const [coverLetterRequired, setCoverLetterRequired] = useState(false);
  // State for handling loading status
  const [loading, setLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(true);
  // Chakra UI Toast hook for displaying messages
  const toast = useToast();
  // Hook for navigation
  const navigate = useNavigate();

  // Custom hook for fetching user data
  const [{ isLoading, apiData, serverError }] = useFetch("");

  // Responsive sizes for button and heading
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Fetch job details by jobId
        const jobDetails = await fetchJobById(jobId);
        setResumeRequired(jobDetails.resumeRequired);
        setCoverLetterRequired(jobDetails.coverLetterRequired);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setJobLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Handle file input changes
  const handleResumeChange = (e) => setResume(e.target.files[0]);
  const handleCoverLetterChange = (e) => setCoverLetter(e.target.files[0]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData object for file uploads
      const formData = new FormData();
      formData.append("name", apiData?.username || "");
      formData.append("email", apiData?.email || "");
      if (resumeRequired && !resume) {
        throw new Error("Resume is required.");
      }
      if (coverLetterRequired && !coverLetter) {
        throw new Error("Cover Letter is required.");
      }
      formData.append("resume", resume);
      if (coverLetterRequired) {
        formData.append("coverLetter", coverLetter);
      }
      formData.append("jobId", jobId);

      // Submit application
      const response = await applyForJob(formData);
      console.log(response);

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/search");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Display loading state or error if applicable
  if (isLoading || jobLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  if (serverError) {
    return <p>Error fetching user data.</p>;
  }

  return (
    <Box p={6} maxW="container.md" mx="auto">
      <Heading as="h1" size={headingSize} mb={4}>
        Apply for Job
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Name</FormLabel>
          <Input type="text" value={apiData?.username || ""} isReadOnly />
        </FormControl>
        <FormControl mb={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={apiData?.email || ""} isReadOnly />
        </FormControl>
        <FormControl mb={4} isRequired={resumeRequired}>
          <FormLabel>Resume (PDF)</FormLabel>
          <Input type="file" accept=".pdf" onChange={handleResumeChange} />
        </FormControl>
        {coverLetterRequired && (
          <FormControl mb={4} isRequired>
            <FormLabel>Cover Letter (PDF)</FormLabel>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleCoverLetterChange}
            />
          </FormControl>
        )}
        <Button
          type="submit"
          colorScheme="teal"
          isLoading={loading}
          size={buttonSize}
        >
          Apply Now
        </Button>
      </form>
    </Box>
  );
};

export default JobApplication;
