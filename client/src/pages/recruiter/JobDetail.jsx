/* Author: Ashish Kumar Guntipalli */

import React, { useState, useEffect } from 'react';
import {
    Box,
    Spinner,
    Center,
    useToast,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Text
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import JobDetailsTab from './JobDetailsTab';
import ApplicantsTab from './ApplicantsTab';
import ConfirmationModal from './ConfirmationModal';
import {
    fetchJobById,
    fetchApplicantsByJobId,
    deleteJobById,
    updateApplicantStatus
} from './helper/jobApis';

const JobDetail = () => {
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { jobId } = useParams();


    useEffect(() => {
        const fetchJob = async () => {
            try {
                if (!jobId) {
                    throw new Error('Job ID is missing');
                }

                const jobData = await fetchJobById(jobId);
                setJob(jobData);
            } catch (error) {
                console.error('Error fetching job:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load job details. Redirecting to dashboard.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/recruiter/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId, toast, navigate]);

    const fetchApplicants = async () => {
        setLoadingApplicants(true);
        try {
            const applicantsData = await fetchApplicantsByJobId(jobId);
            setApplicants(applicantsData);
        } catch (error) {
            console.error('Error fetching applicants:', error);
            toast({
                title: 'No applicants for this job!',
                description: 'There are currently no Applicants for this job',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoadingApplicants(false);
        }
    };

    const handleDelete = async () => {
        try {
            const isDeleted = await deleteJobById(jobId);
            if (isDeleted) {
                toast({
                    title: 'Success',
                    description: 'Job deleted successfully. Redirecting to dashboard.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/recruiter/dashboard');
            } else {
                throw new Error('Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete job. Please try again later.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleStatusChange = async (applicantId, newStatus) => {
        try {
            const isUpdated = await updateApplicantStatus(applicantId, newStatus, jobId);
            if (isUpdated) {
                setApplicants((prevApplicants) =>
                    prevApplicants.map((applicant) =>
                        applicant._id === applicantId ? { ...applicant, status: newStatus } : applicant
                    )
                );
                toast({
                    title: 'Success',
                    description: 'Applicant status updated successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error('Failed to update applicant status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: 'Error',
                description: 'Failed to update applicant status. Please try again later.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        if (tabIndex === 1) {
            fetchApplicants();
        }
    }, [tabIndex, jobId]);

    if (loading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!job) {
        return (
            <Center h="100vh">
                <Text fontSize="lg" color="gray.500">
                    Job not found
                </Text>
            </Center>
        );
    }

    return (
        <Box p={6} maxW="container.xl" mx="auto">
            <Tabs variant="enclosed" index={tabIndex} onChange={(index) => setTabIndex(index)}>
                <TabList>
                    <Tab>Job Details</Tab>
                    <Tab>Applicants</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <JobDetailsTab job={job} onDelete={() => setShowConfirmation(true)} />
                    </TabPanel>
                    <TabPanel>
                        <ApplicantsTab
                            applicants={applicants}
                            loading={loadingApplicants}
                            onStatusChange={handleStatusChange}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onDelete={handleDelete}
            />
        </Box>
    );
};

export default JobDetail;
