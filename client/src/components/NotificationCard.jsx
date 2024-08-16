import React from 'react';
import {
    Box,
    Heading,
    Text,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Flex,
} from '@chakra-ui/react';
import { FaBell, FaEllipsisH, FaTrash, FaRocketchat, FaBriefcase, FaUserCheck } from 'react-icons/fa';
import { formatDistanceToNowStrict } from 'date-fns';

const NotificationCard = ({ heading, createdAt, content, onDelete, type, id }) => {
    const formatTimeAgo = (date) => {
        const duration = formatDistanceToNowStrict(new Date(date), { addSuffix: false });
        const [value, unit] = duration.split(' ');

        switch (unit) {
            case 'second':
            case 'seconds':
                return `${value}s`;
            case 'minute':
            case 'minutes':
                return `${value}m`;
            case 'hour':
            case 'hours':
                return `${value}hr`;
            case 'day':
            case 'days':
                return `${value}d`;
            case 'week':
            case 'weeks':
                return `${value}W`;
            case 'month':
            case 'months':
                return `${value}M`;
            case 'year':
            case 'years':
                return `${value}Y`;
            default:
                return duration;
        }
    };

    const timeAgo = formatTimeAgo(createdAt);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'chat':
                return <FaRocketchat className='mt-1' />;
            case 'application':
                return <FaBriefcase className='mt-1' />;
            case 'statusChange':
                return <FaUserCheck className='mt-1' />;
            default:
                return <FaBell className='mt-1' />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'chat':
                return '#6366F1';
            case 'application':
                return '#FF6A6A';
            case 'statusChange':
                return '#6A7280';
            default:
                return 'gray.400';
        }
    };

    return (
        <Box p={4} w="100%" borderWidth="1px" borderRadius="md" boxShadow="md" marginBottom="3" id={id}>
            <Flex>
                <Box color={getTypeColor(type)}>
                    {getTypeIcon(type)}
                </Box>
                <Flex direction={"column"} w={"85%"} marginRight={'1'}>
                    <Flex alignItems="center">
                        <Heading size="md" ml={2}>{heading}</Heading>
                    </Flex>
                    <Flex>
                        <Text>
                            {content}
                        </Text>
                    </Flex>
                </Flex>
                <Flex direction={"column"} justifyContent={"center"} w={"15%"}>
                    <Text fontSize="sm" color="gray.500" textAlign={'center'}>{timeAgo}</Text>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<FaEllipsisH />}
                            variant="ghost"
                        />
                        <MenuList>
                            <MenuItem icon={<FaTrash />} onClick={onDelete}>
                                Delete Notification
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
        </Box>
    );
};

export default NotificationCard;
