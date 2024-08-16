/* Author: Sivaprakash Chittu Hariharan */
import React, { useState, useEffect } from "react";
import { Box, VStack, Text, Button, IconButton, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BiBookmark, BiBookmarkAlt } from "react-icons/bi";
import { fetchUserBookmarks, toggleBookmark } from "../../search/helper/api";

const JobListing = ({ job, alreadyApplied }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkDisabled, setBookmarkDisabled] = useState(false);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role");
      if (!username || role === "Recruiter") {
        console.error("User not logged in");
        setBookmarkDisabled(true);
        setIsLoading(false);
        return;
      }

      try {
        const bookmarks = await fetchUserBookmarks(username);
        setIsBookmarked(bookmarks.some((bookmark) => bookmark._id === job._id));
        setBookmarkDisabled(false); // Enable button if fetch is successful
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setBookmarkDisabled(true); // Disable button on 401 error
        }
        console.error("Error fetching bookmarks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkStatus();
  }, [job._id]);

  const handleApplyClick = () => {
    navigate(`/job-seeker/jobs/${job._id}`);
  };

  const handleToggleBookmark = async () => {
    const username = localStorage.getItem("username");

    if (!username) {
      console.error("User not logged in");
      return;
    }

    try {
      await toggleBookmark(username, job._id, isBookmarked);
      setIsBookmarked((prev) => !prev); // Toggle state based on previous state
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  return (
    <Box
      p={3}
      shadow="md"
      borderWidth="1px"
      mb={2}
      maxW="md"
      width="100%"
      position="relative"
    >
      <Tooltip
        label="You need to login as student to bookmark!"
        isDisabled={!bookmarkDisabled} 
        placement="right" 
      >
          <IconButton 
            icon={isBookmarked ? <BiBookmark /> : <BiBookmarkAlt />}
            onClick={handleToggleBookmark}
            colorScheme={isBookmarked ? "teal" : "gray"}
            size="sm"
            position="absolute"
            top="8px"
            right="8px"
            aria-label="Bookmark"
            isDisabled={bookmarkDisabled}
            isLoading={isLoading} 
          />
      </Tooltip>
      <VStack align="flex-start" spacing={2}>
        <Text fontSize="lg" fontWeight="bold">
          {job.positionName}
        </Text>
        <Text>{job.companyName}</Text>
        <Text>
          <strong>Location:</strong> {job.location}
        </Text>
        <Text>
          <strong>Responsibilities:</strong> {job.jobDescription}
        </Text>
        <Text>
          <strong>Salary:</strong> ${job.salary}
        </Text>
        <Button
          colorScheme={alreadyApplied ? "gray" : "teal"}
          size="sm"
          alignSelf="flex-end"
          onClick={handleApplyClick}
          isDisabled={alreadyApplied}
        >
          {alreadyApplied ? "Already Applied" : "View Details"}
        </Button>
      </VStack>
    </Box>
  );
};

export default JobListing;
