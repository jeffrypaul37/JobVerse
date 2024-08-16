# Jobverse: Bridging The Gap Between Job Seekers and Employers

* *Deployed Application URL*: <https://job-verse.vercel.app/>

## Authors

* [Sivasubramanian Venkatasubramanian](sv386677@dal.ca) - *(Fullstack Developer)*
* [Jeffry Paul Suresh Durai](jeffrypaul.sureshdurai@dal.ca) - *(Fullstack Developer)*
* [Ashish Kumar Guntipalli](as589490@dal.ca) - *(Fullstack Developer)*
* [Bhishman Desai](bhishman@dal.ca) - *(Fullstack Developer)*
* [Sivaprakash Chittu Hariharan](sivaprakash.chittu@dal.ca) - *(Fullstack Developer)*
* [Jayrajsinh Mahavirsinh Jadeja](jy688645@dal.ca) - *(Fullstack Developer)*

## Getting Started
### Steps to Set Up the Project   

```   git clone https://github.com/jeffrypaul37/JobVerse.git
cd csci-4177-5709-grp-11/client      
npm install     
npm start  
```

### Prerequisites

```  
Node environment (v20.13.1) 

```  

## Deployment

We deployed our web application using GitHub and Vercel. First, We created a new private repository on GitHub and pushed the project code to it. Then, We imported this repository into Vercel, configured the build settings, and initiated the deployment.  

## Built With

* [React](https://react.dev/learn) - The web framework used
* [npm](https://docs.npmjs.com) - Dependency Management

## Sources Used

### App.js

*Lines 7 - 20*

```
const Home = lazy(() => import("./pages/Home"));
const FaqPage = lazy(() => import("./pages/Faq"));
const ContactPage = lazy(() => import("./pages/Contact"));

/* Auth Pages */
const UserNamePage = lazy(() => import("./pages/auth/Username"));
const PasswordPage = lazy(() => import("./pages/auth/Password"));
const RegisterPage = lazy(() => import("./pages/auth/Register"));
const ProfilePage = lazy(() => import("./pages/auth/Profile"));
const RecoveryPage = lazy(() => import("./pages/auth/Recovery"));
const ResetPage = lazy(() => import("./pages/auth/Reset"));

/* Page Not Found */
const PageNotFoundPage = lazy(() => import("./components/pageNotFound"));

```

The code above was created by adapting the code in [react.dev](https://react.dev/reference/react/lazy) as shown below: 

```
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

```

- The code in [react.dev](https://react.dev/reference/react/lazy) was implemented by throughouly understanding the lazy loading concept.
- [react.dev](https://react.dev/reference/react/lazy)'s Code was used because it improves the application perfomance by reducing the initial load time.
- [react.dev](https://react.dev/reference/react/lazy)'s Code was modified by using our own component instead of the own given in example.

### Background.png

The image used in this project was sourced from [Pexels](https://www.pexels.com/).


### validate.js

*Lines 50 - 76*

``` js
function passwordVerify(errors = {}, values) {
  
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const lowerCase = /[a-z]/;
  const upperCase = /[A-Z]/;
  const number = /[0-9]/;

  if (!values.password) {
    errors.password = toast.error("Password Required!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Invalid Password!");
  } else if (values.password.length < 8) {
    errors.password = toast.error(
      "Password must be at least 8 characters long!",
    );
  } else if (!specialChars.test(values.password)) {
    errors.password = toast.error("Password must contain a special character!");
  } else if (!lowerCase.test(values.password)) {
    errors.password = toast.error("Password must contain a lowercase letter!");
  } else if (!upperCase.test(values.password)) {
    errors.password = toast.error("Password must contain an uppercase letter!");
  } else if (!number.test(values.password)) {
    errors.password = toast.error("Password must contain a number!");
  }

  return errors;
}   
  
```  

The code above was created by adapting the code in [Wiktor Stribiżew](https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a) as shown below:


```js

"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$"

```

[Wiktor Stribiżew](https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a)'s code was used because I wanted to add regex checks for password validation and wanted to make sure that I don't miss out on any edge cases.

[Wiktor Stribiżew](https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a)'s code was modified by breaking down the regex into different regex each serving their own purpose.

### convert.js

*Lines 1 - 15*

``` js
/* Image to base64 */
export default function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result)
        }

        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}
  
```  

The code above was created by adapting the code in [Dmitri Pavlutin](https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript) as shown below:


```js
function getBase64(file) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
     console.log(reader.result);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
}

var file = document.querySelector('#files > input[type="file"]').files[0];
getBase64(file); // prints the base64 string
```



[Dmitri Pavlutin](https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript)'s code was used because I wanted to convert file to base64 in JavaScript. This is mainly to let users upload their profile pictures at the time of user registration process.

[Dmitri Pavlutin](https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript)'s code was modified by instead of directly logging the result or error, I wrapped the FileReader operations within a Promise for my use case. This way I was able to use resolve to return the base64 string upon successful reading and reject to handle any errors.



ChatGPT was used to generate the basic chat functionality. 
This code was further modified to include the following:

* Persisting chat messages and previously interacted users in database.
* Displaying all past chat messages and the users previously interacted with in the chat list.
* Displaying timestamps under messages and grouping messages by dates.
* Displaying a symbol next to a user in the chat list to indicate the presence of unread messages in the chat. 

The prompt given was:
"Generate code for a React app that implements a live chat functionality between the currently logged in user and other users."

The code generated was:

### models/Chat.js

```
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [MessageSchema]
});

export default mongoose.model('Chat', ChatSchema);
```

### routes/chat.js

```
import express from 'express';
import Chat from '../models/Chat';
import User from '../models/User';
const router = express.Router();

// Create a new chat
router.post('/create', async (req, res) => {
  const { users } = req.body;
  const chat = new Chat({ users, messages: [] });
  await chat.save();
  res.status(201).json(chat);
});

// Send a message
router.post('/message', async (req, res) => {
  const { chatId, sender, receiver, message } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }
  chat.messages.push({ sender, receiver, message });
  await chat.save();
  res.status(201).json(chat);
});

// Get all chats for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const chats = await Chat.find({ users: userId }).populate('users').populate('messages.sender').populate('messages.receiver');
  res.status(200).json(chats);
});

export default router;
```

### server.js

```
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat';
dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected!'))
  .catch(err => console.error(err));

app.use('/api/chat', chatRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
```

### src/components/Chat/ChatList.js

```
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChatList = ({ userId }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios.get(`/api/chat/${userId}`).then(response => {
      setChats(response.data);
    });
  }, [userId]);

  return (
    <div>
      {chats.map(chat => (
        <Link key={chat._id} to={`/chat/${chat._id}`}>
          {chat.users.map(user => user._id !== userId && <div key={user._id}>{user.username}</div>)}
        </Link>
      ))}
    </div>
  );
};

export default ChatList;
```

### src/components/Chat/ChatBox.js

```
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatBox = ({ userId }) => {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`/api/chat/${chatId}`).then(response => {
      setChat(response.data);
    });
  }, [chatId]);

  const sendMessage = () => {
    axios.post('/api/chat/message', {
      chatId,
      sender: userId,
      receiver: chat.users.find(user => user._id !== userId)._id,
      message
    }).then(response => {
      setChat(response.data);
      setMessage('');
    });
  };

  return (
    <div>
      <div>
        {chat && chat.messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender.username}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
```


### search.jsx (client/src/pages/search/search.jsx)

*Lines 136 - 270*

```
 <Box p={[2, 3, 5]}>
        <Center mb={[3, 4, 5]}>
          <VStack spacing={[3, 4]} align="center" width="100%">
            <Stack
              direction={stackDirection}
              spacing={[2, 3, 4]}
              width="100%"
              justifyContent="center"
              align="center"
            >
              <Input
                placeholder="Job Title"
                width={inputWidth}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="Select Location"
                width={inputWidth}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Ontario">Ontario</option>
                <option value="British Columbia">British Columbia</option>
                <option value="Alberta">Alberta</option>
                <option value="Manitoba">Manitoba</option>
                <option value="New Brunswick">New Brunswick</option>
                <option value="Newfoundland and Labrador">
                  Newfoundland and Labrador
                </option>
                <option value="Nova Scotia">Nova Scotia</option>
                <option value="Prince Edward Island">
                  Prince Edward Island
                </option>
                <option value="Quebec">Quebec</option>
                <option value="Saskatchewan">Saskatchewan</option>
                <option value="Northwest Territories">
                  Northwest Territories
                </option>
                <option value="Nunavut">Nunavut</option>
                <option value="Yukon">Yukon</option>
              </Select>
              <Button
                colorScheme="teal"
                height="40px"
                width={["80px", "100px"]}
                onClick={handleSearch}
              >
                Search
              </Button>
              <Button variant="link" onClick={toggleFilters}>
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </Stack>
            <Collapse in={showFilters}>
              <Stack
                direction={stackDirection}
                spacing={[2, 3, 4]}
                mt={[2, 3, 4]}
                justifyContent="center"
                width="100%"
                align="center"
              >
                <Select
                  placeholder="Date Posted"
                  width={inputWidth}
                  height="40px"
                  value={datePosted}
                  onChange={(e) => setDatePosted(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                </Select>
                <Select
                  placeholder="Pay Range"
                  width={inputWidth}
                  height="40px"
                  value={payRange}
                  onChange={(e) => setPayRange(e.target.value)}
                >
                  <option value="0-50000">$0 - $50k</option>
                  <option value="50000-100000">$50k - $100k</option>
                  <option value="100000">$100k+</option>
                </Select>
              </Stack>
            </Collapse>
          </VStack>
        </Center>
        <Center>
          <VStack spacing={[3, 4]} width="100%">
            {errorMessage ? (
              <Text color="red.500">{errorMessage}</Text>
            ) : (
              paginatedJobs.map((job) => {
                const alreadyApplied = applications.some(
                  (application) => application.jobId._id === job._id
                );
                return (
                  <JobListing
                    key={job._id}
                    job={job}
                    alreadyApplied={alreadyApplied}
                  />
                );
              })
            )}
            {jobs.length > jobsPerPage && (
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    colorScheme={index + 1 === currentPage ? "teal" : "gray"}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </Stack>
            )}
          </VStack>
        </Center>
      </Box>
```
The code above was created by adapting the code in [Box - Chakra UI](https://v2.chakra-ui.com/docs/components/box) as shown below: 
```
<Box as='button' borderRadius='md' bg='tomato' color='white' px={4} h={8}>
  Button
</Box>

```
- The code in [Box - Chakra UI](https://v2.chakra-ui.com/docs/components/box)was thoroughly reviewed, and after understanding the source code and its functionality, I modified it to fit the requirements of my assignment.
- [Box - Chakra UI](https://v2.chakra-ui.com/docs/components/box) code was used because it provides a basic template. My goal was to search for different available components and to gain knowledge of these components. Using external code and modifying it according to my assignment's needs, while also ensuring it was responsive, sped up my development time. Also refered similarly for other chakra UI layouts like Select,Input,Button,Stack,VStack,Center,Text,Collapse,Spinner .
- [Box - Chakra UI](https://v2.chakra-ui.com/docs/components/box) code was modified according to the needs of my component, such as changing attributes and properties (e.g., the className property) to fit my assignment's requirements, and adding some extra components. 



### api.js (client/src/pages/search/helper/api.js)

*Lines 09 - 17*

```
export const fetchJobs = async (params) => {
  try {
    const response = await axios.get('/api/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Error fetching jobs. Please try again later.');
  }
};

```
The code above was created by adapting the code in [How To Use Axios With React: The Definitive Guide (2021)](https://www.freecodecamp.org/news/how-to-use-axios-with-react/) as shown below: 

```
import axios from "axios";
import React from "react";

const baseURL = "https://jsonplaceholder.typicode.com/posts/1";

export default function App() {
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data);
    });
  }, []);

  if (!post) return null;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}
```
- The code in [How To Use Axios With React: The Definitive Guide (2021)](https://www.freecodecamp.org/news/how-to-use-axios-with-react/)was thoroughly reviewed, and after understanding the source code and its functionality, I modified it to fit the requirements of my assignment.
- [How To Use Axios With React: The Definitive Guide (2021)](https://www.freecodecamp.org/news/how-to-use-axios-with-react/) code was used because it provides a basic template. I took reference how axios call happens and used based on my requirements.
- [How To Use Axios With React: The Definitive Guide (2021)](https://www.freecodecamp.org/news/how-to-use-axios-with-react/) code was modified according to the needs of my based on assignment needs.

### jobListings.js (client/src/pages/search/helper/jobListings.js)

*Lines 15 - 40*

```
<Box p={3} shadow="md" borderWidth="1px" mb={2} maxW="md" width="100%">
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

```
The code above was created by adapting the code in [Box - Chakra UI](https://v2.chakra-ui.com/docs/components/box) as shown below: 

```
<Box as='button' borderRadius='md' bg='tomato' color='white' px={4} h={8}>
  Button
</Box>
```
- The code in [Box - Chakra UI](https://v2.chakra-ui.com/docs/components/box)was thoroughly reviewed, and after understanding the source code and its functionality, I modified it to fit the requirements of my assignment.
- [Box - Chakra UI](https://v2.chakra-ui.com/docs/components/box) code was used because it provides a basic template. My goal was to search for different available components and to gain knowledge of these components. Using external code and modifying it according to my assignment's needs, while also ensuring it was responsive, sped up my development time. Also refered similarly for other chakra UI layouts.
- [Box - Chakra UI](https://v2.chakra-ui.com/docs/components/box) code was modified according to the needs of my component, such as changing attributes and properties (e.g., the className property) to fit my assignment's requirements, and adding some extra components. 


### searchContoller.js (server/controllers/searchControllers.js)

*Lines 19 - 31*

```
 if (datePosted) {
      const date = new Date();
      if (datePosted === 'today') {
        date.setHours(0, 0, 0, 0);
        query.createdAt = { $gte: date };
      } else if (datePosted === 'this_week') {
        date.setDate(date.getDate() - 7);
        query.createdAt = { $gte: date };
      } else if (datePosted === 'this_month') {
        date.setMonth(date.getMonth() - 1);
        query.createdAt = { $gte: date };
      }
    }

```
The code above was created by adapting the code in [Date - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) as shown below: 

```
const event = new Date('August 19, 1975 23:15:30');
event.setHours(20);

console.log(event);
// Expected output: "Tue Aug 19 1975 20:15:30 GMT+0200 (CEST)"
// Note: your timezone may vary

event.setHours(20, 21, 22);

console.log(event);


const event = new Date('August 19, 1975 23:15:30');

event.setDate(24);

console.log(event.getDate());
// Expected output: 24

event.setDate(32);
// Only 31 days in August!

console.log(event.getDate());
// Expected output: 1

const event = new Date('August 19, 1975 23:15:30');

event.setMonth(3);

console.log(event.getMonth());
// Expected output: 3

console.log(event);

```
- The code in [Date - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) was thoroughly reviewed, and after understanding the source code and its functionality, I modified it to fit the requirements of my assignment.
- [Date - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) code was used because it provides all date Objects required. Used it based on my assignment requirements . 
- [Date - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) Different date objects was used based on my requirements.


### searchFunc.js (server/router/api/search/searchFunc.js)

*Line 8*

```
router.get('/', searchJobs);


```
The code above was created by adapting the code in [Express Tutorial Part 4: Routes and controllers - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes) as shown below: 

```
const express = require("express");
const router = express.Router();

// Home page route.
router.get("/", function (req, res) {
  res.send("Wiki home page");
});

// About page route.
router.get("/about", function (req, res) {
  res.send("About this wiki");
});

module.exports = router;

```
- The code in [Express Tutorial Part 4: Routes and controllers - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes)was thoroughly reviewed, and after understanding the source code and its functionality, I modified it to fit the requirements of my assignment.
- [Express Tutorial Part 4: Routes and controllers - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes) code was used because it provides a basic template of routes.
- [Express Tutorial Part 4: Routes and controllers - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes) code was used according to the needs of my assignment.

## Acknowledgments

* For responsive navbar we took inspiration from [Indeed](https://ca.indeed.com/)
* For Home Landing page the Jobillico website home is taken as inspiration [Jobillico](https://www.jobillico.com/en)
