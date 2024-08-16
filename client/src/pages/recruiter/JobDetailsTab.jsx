/* Author: Ashish Kumar Guntipalli */

import { Box, Heading, Text, Stack, Button, useBreakpointValue } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const JobDetailsTab = ({ job, onDelete }) => {
    const navigate = useNavigate();
    
    // Responsive button size and stack direction
    const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
    const stackDirection = useBreakpointValue({ base: 'column', md: 'row' });

    return (
        <Stack spacing={6} p={{ base: 2, md: 4 }} align="start">
            <Heading as="h1" size={{ base: 'xl', md: '2xl' }} textAlign="center" w="full">
                {job.positionName}
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
                Salary: ${job.salary}
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
                Available Positions: {job.positionsAvailable}
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
                Job Description:
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} whiteSpace="pre-line">
                {job.jobDescription}
            </Text>
            <Stack direction={stackDirection} spacing={4} mt={4} w="full" justifyContent={{ base: 'center', md: 'flex-start' }}>
                <Button size={buttonSize} colorScheme="teal" onClick={() => navigate(`/recruiter/update-job/${job._id}`)}>
                    <EditIcon mr={2} />
                    Edit Job
                </Button>
                <Button size={buttonSize} colorScheme="red" onClick={onDelete}>
                    <DeleteIcon mr={2} />
                    Delete Job
                </Button>
                <Button size={buttonSize} colorScheme="gray" onClick={() => navigate('/recruiter/dashboard')}>
                    <ArrowBackIcon mr={2} />
                    Back to Dashboard
                </Button>
            </Stack>
        </Stack>
    );
};

export default JobDetailsTab;
