import React, { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import { Flex, Spinner } from '@chakra-ui/react';
import ChatWidget from '../ChatWidget';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navNotRequired = ['/login', '/password', '/register', '/recovery', '/reset'];
    const currentPath = location.pathname;
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    })
    return (
        <div className="min-h-screen flex flex-col">
            {!navNotRequired.includes(currentPath) && <Navbar />}
            <main className="flex-grow">
                <Suspense fallback={
                    <Flex align="center" justify="center" w="100" h="100">
                        <Spinner size="xl" />
                    </Flex>
                }>
                    {children}
                    {isLoggedIn && <ChatWidget />}
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
