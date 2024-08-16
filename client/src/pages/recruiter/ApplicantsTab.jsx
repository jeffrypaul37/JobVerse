/* Author: Ashish Kumar Guntipalli */

import React from 'react';
import {
    Box,
    Spinner,
    Center,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Text,
    Stack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    ButtonGroup,
    useBreakpointValue,
} from '@chakra-ui/react';

const ApplicantsTab = ({ applicants, loading, onStatusChange }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [pdfUrl, setPdfUrl] = React.useState('');
    const [pdfType, setPdfType] = React.useState('');

    const handleViewPdf = (url, type) => {
        setPdfUrl(url);
        setPdfType(type);
        onOpen();
    };

    const tableVariant = useBreakpointValue({ base: 'simple', md: 'striped' });

    return loading ? (
        <Center h="100vh">
            <Spinner size="xl" />
        </Center>
    ) : (
        <Box p={{ base: 2, md: 4 }}>
            <Table variant={tableVariant} width="full" size="sm">
                <Thead>
                    <Tr>
                        <Th minWidth={{ base: '100px', md: '150px' }}>Name</Th>
                        <Th display={{ base: 'none', md: 'table-cell' }} minWidth="200px">Email</Th>
                        <Th minWidth={{ base: '100px', md: '150px' }}>Status</Th>
                        <Th minWidth={{ base: '100px', md: '150px' }}>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {applicants.length > 0 ? (
                        applicants.map((applicant) => (
                            <Tr key={applicant._id}>
                                <Td>{applicant.name}</Td>
                                <Td display={{ base: 'none', md: 'table-cell' }}>{applicant.email}</Td>
                                <Td>
                                    <ButtonGroup size="xs" isAttached flexDirection={{ base: 'column', sm: 'row' }}>
                                        <Button
                                            colorScheme={applicant.status === 'Interview' ? 'teal' : 'gray'}
                                            onClick={() => onStatusChange(applicant._id, 'Interview')}
                                            mb={{ base: 1, sm: 0 }}
                                        >
                                            Interview
                                        </Button>
                                        <Button
                                            colorScheme={applicant.status === 'Accepted' ? 'green' : 'gray'}
                                            onClick={() => onStatusChange(applicant._id, 'Accepted')}
                                            mb={{ base: 1, sm: 0 }}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            colorScheme={applicant.status === 'Rejected' ? 'red' : 'gray'}
                                            onClick={() => onStatusChange(applicant._id, 'Rejected')}
                                        >
                                            Reject
                                        </Button>
                                    </ButtonGroup>
                                </Td>
                                <Td>
                                    <Stack direction={{ base: 'column', sm: 'row' }} spacing={2} align="center">
                                        <Button
                                            colorScheme="blue"
                                            size="xs"
                                            onClick={() => handleViewPdf(applicant.resume, 'Resume')}
                                        >
                                            View Resume
                                        </Button>
                                        <Button
                                            colorScheme="blue"
                                            size="xs"
                                            onClick={() => handleViewPdf(applicant.coverLetter, 'Cover Letter')}
                                        >
                                            View Cover Letter
                                        </Button>
                                    </Stack>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan="4">
                                <Text textAlign="center">No applicants found</Text>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{pdfType} Viewer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {pdfUrl ? (
                            <iframe src={pdfUrl} width="100%" height="600px" title="PDF Viewer"></iframe>
                        ) : (
                            <Text>No {pdfType.toLowerCase()} is available for this applicant</Text>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ApplicantsTab;
