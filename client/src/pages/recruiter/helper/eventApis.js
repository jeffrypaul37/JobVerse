import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/* Create events */
export const createEvent = async (eventData) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`/api/event/createEvent`, eventData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error creating Event');
    }
};

/* Fetch events for a specific recruiter */
export const fetchEvents = async (recruiterId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`/api/event/getEvents`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { recruiterId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events.');
    }
};

/* Update a specific event */
export const updateEvent = async (eventId, eventData) => {
    const token = localStorage.getItem("token");
    try {
        await axios.put(`/api/event/updateEvent/${eventId}`, eventData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error updating event:', error);
        throw new Error('Failed to update event.');
    }
};

/* Delete a specific Event */
export const deleteEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
        await axios.delete(`/api/event/deleteEvent/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        throw new Error('Failed to delete event.');
    }
};

/* Fetch applicants for a specific event */
export const fetchApplicantsByEventId = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`/api/event/getApplicantsByEventId/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching applicants:', error);
        throw new Error('Failed to fetch applicants.');
    }
};

/* Fetch a specific event by ID */
export const fetchEventById = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`/api/event/getEvents/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching job details:', error);
        throw new Error('Failed to fetch job details.');
    }
};

