import React, { useEffect } from 'react';
import {
    Box,
    Text,
    Flex
} from '@chakra-ui/react';
import NotificationCard from '../components/NotificationCard';
import { useSocketStore } from '../store/store';

const Notifications = () => {
    const notifications = useSocketStore((state) => state.notifications);
    const fetchNotifications = useSocketStore((state) => state.fetchNotifications);
    const markNotificationsAsRead = useSocketStore((state) => state.markNotificationsAsRead);
    const deleteNotification = useSocketStore((state) => state.deleteNotification);

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchNotifications();
                markNotificationsAsRead();
            } catch (error) {
                console.error('Error loading notifications:', error);
            }
        };
        loadData();
    }, []);

    const handleDelete = (id) => {
        deleteNotification(id);
    };

    return (
        <Box zIndex="-10">
            <Flex w={["100%", "95%", "50%", "50%"]} m="auto" justifyContent='flex-start' align="top" flexDir={"column"}>
                <Text fontSize="3xl" my="3" textAlign="flex-start" ml="5" fontWeight="medium">Notifications</Text>
                <Flex w="100%" justifyContent={'center'} marginLeft={10} marginRight={10} direction={'column'}>
                    {notifications.length === 0 ? (
                        <Text fontSize="xl" my="3" textAlign="center" color="gray.500">No notifications to display</Text>
                    ) : (
                        notifications.map((notification) => (
                            <NotificationCard
                                key={notification._id}
                                id={notification._id}
                                heading={notification.heading}
                                type={notification.type}
                                content={notification.content}
                                createdAt={notification.createdAt}
                                onDelete={() => handleDelete(notification._id)}
                            />
                        ))
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};

export default Notifications;
