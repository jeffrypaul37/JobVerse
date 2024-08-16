/* Author: Sivaprakash Chittu Hariharan */
import React, { useState, useEffect, useRef } from "react";
import {
  ChakraProvider,
  Box,
  Input,
  Select,
  Button,
  Stack,
  VStack,
  Center,
  Text,
  Collapse,
  useBreakpointValue,
  Spinner,
} from "@chakra-ui/react";
import JobListing from "./helper/jobListings";
import { fetchJobs } from "./helper/api";
import { useJobSearchStore } from "../../store/store.js";

const JobSearch = () => {
  const [location, setLocation] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [payRange, setPayRange] = useState("");
  const [jobs, setJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const [loading, setLoading] = useState(false); // Set initial loading to false
  const [searchTerm, setSearchTerm] = useState("");

  const jobTitle = useJobSearchStore((state) => state.jobTitle);
  const setJobTitle = useJobSearchStore((state) => state.setJobTitle);
  

  // Update searchTerm when jobTitle changes
  useEffect(() => {
    setSearchTerm(jobTitle);
    handleSearchfirst();
  }, [jobTitle]);


  const toggleFilters = () => setShowFilters(!showFilters);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const jobsData = await fetchJobs({
        jobTitle: searchTerm,
        location,
        datePosted,
        payRange,
      });
      setJobs(jobsData);
      setCurrentPage(1);
      setErrorMessage(jobsData.length ? "" : "No job postings found.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchfirst = async () => {
    setLoading(true);
    try {
      const jobsData = await fetchJobs({
        jobTitle: jobTitle,
        location,
        datePosted,
        payRange,
      });
      setJobs(jobsData);
      setCurrentPage(1);
      setErrorMessage(jobsData.length ? "" : "No job postings found.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page) => setCurrentPage(page);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const stackDirection = useBreakpointValue({ base: "column", md: "row" });
  const inputWidth = useBreakpointValue({ base: "100%", md: "200px" });

  
  return (
    <ChakraProvider>
      <Box p={[2, 3, 5]}>
        <Center mb={[3, 4, 5]}>
          <VStack spacing={[3, 4]} align="center" width="100%">
            <Stack
              direction={stackDirection}
              spacing={[2, 3, 4]}
              width="100%"
              justifyContent="center"
              align="center"
            >
              <Input
                placeholder="Job Title"
                width={inputWidth}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="Select Location"
                width={inputWidth}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {/* Location options */}
                <option value="Ontario">Ontario</option>
                <option value="British Columbia">British Columbia</option>
                <option value="Alberta">Alberta</option>
                <option value="Manitoba">Manitoba</option>
                <option value="New Brunswick">New Brunswick</option>
                <option value="Newfoundland and Labrador">
                  Newfoundland and Labrador
                </option>
                <option value="Nova Scotia">Nova Scotia</option>
                <option value="Prince Edward Island">
                  Prince Edward Island
                </option>
                <option value="Quebec">Quebec</option>
                <option value="Saskatchewan">Saskatchewan</option>
                <option value="Northwest Territories">
                  Northwest Territories
                </option>
                <option value="Nunavut">Nunavut</option>
                <option value="Yukon">Yukon</option>
              </Select>
              <Button
                colorScheme="teal"
                height="40px"
                width={["80px", "100px"]}
                onClick={handleSearch}
              >
                Search
              </Button>
              <Button variant="link" onClick={toggleFilters}>
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </Stack>
            <Collapse in={showFilters}>
              <Stack
                direction={stackDirection}
                spacing={[2, 3, 4]}
                mt={[2, 3, 4]}
                justifyContent="center"
                width="100%"
                align="center"
              >
                <Select
                  placeholder="Date Posted"
                  width={inputWidth}
                  height="40px"
                  value={datePosted}
                  onChange={(e) => setDatePosted(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                </Select>
                <Select
                  placeholder="Pay Range"
                  width={inputWidth}
                  height="40px"
                  value={payRange}
                  onChange={(e) => setPayRange(e.target.value)}
                >
                  <option value="0-50000">$0 - $50k</option>
                  <option value="50000-100000">$50k - $100k</option>
                  <option value="100000">$100k+</option>
                </Select>
              </Stack>
            </Collapse>
          </VStack>
        </Center>
        <Center>
          <VStack spacing={[3, 4]} width="100%">
            {errorMessage ? (
              <Text color="red.500">{errorMessage}</Text>
            ) : (
              paginatedJobs.map((job) => <JobListing key={job._id} job={job} />)
            )}
            {jobs.length > jobsPerPage && (
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    colorScheme={index + 1 === currentPage ? "teal" : "gray"}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </Stack>
            )}
          </VStack>
        </Center>
      </Box>
    </ChakraProvider>
  );
};

export default JobSearch;
