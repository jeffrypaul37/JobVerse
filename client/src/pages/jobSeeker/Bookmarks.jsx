import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Heading, useBreakpointValue, Text, Center, Spinner } from '@chakra-ui/react';
import JobListing from '../search/helper/jobListings';
import { fetchUserBookmarks } from './helper/jobApis'; // Adjust the import path as necessary

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        console.error("User not logged in");
        setLoading(false);
        return;
      }
      
      try {
        const data = await fetchUserBookmarks(username);
        setBookmarks(data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []); // Empty dependency array to run only on mount

  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <Center h="100vh">
        <Text fontSize="lg" color="gray.500">You have not bookmarked any jobs!</Text>
      </Center>
    );
  }

  return (
    <Box p={4} maxW="container.lg" mx="auto">
      <Heading mb={4} textAlign="center">
        Job Bookmarks
      </Heading>
      <SimpleGrid columns={columns} spacing={4}>
        {bookmarks.map((job) => (
          <JobListing
            key={job._id}
            job={job}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Bookmarks;
