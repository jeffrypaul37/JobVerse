/* Author: Ashish Kumar Guntipalli */

import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';

const ConfirmationModal = ({ isOpen, onClose, onDelete }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Deletion</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Are you sure you want to delete this job? This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={onDelete} mr={3}>
                        Delete
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmationModal;
