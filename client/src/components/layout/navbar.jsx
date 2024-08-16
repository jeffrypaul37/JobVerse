import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Link, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Image, Button, Icon, Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaBell, FaUser } from 'react-icons/fa';
import logo from '../../assets/Jobverse.jpeg';
import { useSocketStore } from '../../store/store';

import { useToast } from '@chakra-ui/react';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // State to manage user role
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast(); 
  const links = [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact us", path: "/contact-us" },
    { name: "Dashboard", path: "/recruiter/dashboard", role: "recruiter" },
    { name: "Create Job", path: "/recruiter/create-job", role: "recruiter" },
    { name: "Create Event", path: "/recruiter/create-event", role: "recruiter" },
    { name: "My Events", path: "/recruiter/events-dashboard", role: "recruiter" },
    { name: "Applications", path: "/job-seeker/applications", role: "student" },
    { name: "Bookmarks", path: "/job-seeker/bookmarks", role: "student" },
    { name: "Events", path: "/job-seeker/view-events", role: "student" }
  ];

  const newNotification = useSocketStore((state) => state.newNotification);
  const clearNewNotification = useSocketStore((state) => state.clearNewNotification);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      // Fetch user role from API or localStorage
      const role = localStorage.getItem('role'); // Replace with API call if needed
      setUserRole(role);
    }
  }, []);

  const handleSelect = (link) => {
    setSelected(link);
  };

  useEffect(() => {
    const currentLink = links.find(link => link.path === location.pathname);
    if (currentLink) {
      handleSelect(currentLink.name);
    }
  }, [location.pathname]);

  const handleNotificationClick = () => {
    clearNewNotification();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
  
    // Show toast notification
    toast({
      title: "Logged out",
      description: "You have logged out successfully.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  
    // Delay navigation slightly to allow toast to display
    setTimeout(() => {
      navigate('/');
    }, 2500); // Adjust the delay as needed
  };
  

  const renderLinks = () => {
    if (isLoggedIn) {
      if (userRole === 'Recruiter') {

        return links.filter(link => link.role === 'recruiter').map(link => (
          <Link
            as={NavLink}
            to={link.path}
            key={link.name}
            px={4}
            py={2}
            className="text-black font-semibold"
            borderBottom={{ base: 'none', md: selected === link.name ? "2px solid black" : "none" }}
            onClick={() => handleSelect(link.name)}
            _hover={{ backgroundColor: 'gray.300' }}
          >
            {link.name}
          </Link>
        ));
      } else {
        return links.filter(link => link.role === 'student').map(link => (
          <Link
            as={NavLink}
            to={link.path}
            key={link.name}
            px={4}
            py={2}
            className="text-black font-semibold"
            borderBottom={{ base: 'none', md: selected === link.name ? "2px solid black" : "none" }}
            onClick={() => handleSelect(link.name)}
            _hover={{ backgroundColor: 'gray.300' }}
          >
            {link.name}
          </Link>
        ));
      }
    }
    return links.filter(link => !link.role).map(link => (
      <Link
        as={NavLink}
        to={link.path}
        key={link.name}
        px={4}
        py={2}
        className="text-black font-semibold"
        borderBottom={selected === link.name ? "2px solid black" : "none"}
        onClick={() => handleSelect(link.name)}
        _hover={{ backgroundColor: 'gray.300' }}
      >
        {link.name}
      </Link>
    ));
  };

  return (
    <Box className="bg-white-500 border-b-2 border-black-900 p-4">
      <Flex justify={["space-between", "space-between", "flex-start", "flex-start"]} align="center">
        <Box>
          <Link as={NavLink} to="/" onClick={() => handleSelect("Home")}>
            <Image
              src={logo}
              alt="Company Logo"
              objectFit="contain"
              aspectRatio="1"
              width={"90px"}
              height={"50px"}
            />
          </Link>
        </Box>
        <Flex ml={4} display={{ base: 'none', md: 'flex' }}>
          {renderLinks()}
        </Flex>
        <Flex ml="auto">
          {isLoggedIn ? (
            <>
              <Link
                as={NavLink}
                to="/notifications"
                px={4}
                py={2}
                onClick={handleNotificationClick}
                _hover={{ backgroundColor: 'gray.300' }}
              >
                <Box position="relative" display="inline-block">
                  <Icon as={FaBell} boxSize={6} />
                  {newNotification && (
                    <Box
                      position="absolute"
                      top="0"
                      right="0"
                      width="8px"
                      height="8px"
                      borderRadius="50%"
                      backgroundColor="orange"
                    />
                  )}
                </Box>
              </Link>
              <Menu>
                <MenuButton as={Button} px={4} py={2} backgroundColor="transparent" _hover={{ backgroundColor: 'gray.300' }}>
                  <Box display="inline-block">
                    <Icon as={FaUser} boxSize={6} />
                  </Box>
                </MenuButton>
                <MenuList>
                  <MenuItem as={NavLink} to="/profile">Update Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Button as={NavLink} to="/login" ml={4}>
              Login
            </Button>
          )}
          <IconButton
            display={{ base: 'block', md: 'none' }}
            icon={<HamburgerIcon />}
            aria-label="Open Menu"
            onClick={onOpen}
            className="ml-3"
          />
        </Flex>
      </Flex>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <Flex direction="column">
                {renderLinks()}
                {isLoggedIn ? (
                  <>
                    <Link
                      as={NavLink}
                      to="/profile"
                      display="block"
                      px={4}
                      py={2}
                      className="text-black font-semibold"
                      _hover={{ backgroundColor: 'gray.300' }}
                    >
                      Update Profile
                    </Link>
                    <Link
                      display="block"
                      px={4}
                      py={2}
                      className="text-black font-semibold"
                      onClick={() => {
                        handleLogout();
                        onClose();
                      }}
                      _hover={{ backgroundColor: 'gray.300' }}
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <Link
                    as={NavLink}
                    to="/login"
                    display="block"
                    px={4}
                    py={2}
                    className="text-black font-semibold rounded-lg"
                    onClick={onClose}
                    _hover={{ backgroundColor: 'gray.300' }}
                  >
                    Login
                  </Link>
                )}
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default Navbar;
