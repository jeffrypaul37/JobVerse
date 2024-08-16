import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export const applyForEvent = async (eventId) => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  try {
    const response = await axios.post(`/api/event/joinEvent`, {
      eventId: eventId,
      name: username,
      email: email
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error applying for Event:",
      error.response ? error.response.data : error.message
    );
    throw new Error(error.message);
  }
};