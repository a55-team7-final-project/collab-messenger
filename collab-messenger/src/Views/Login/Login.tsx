import React, { useContext, useEffect, useState } from "react";
import { loginUser } from "../../services/authentication-services";
import { AppContext } from "../../context/AppContext";
import { getUserData } from "../../services/user-services";
import { Link } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, Link as ChakraLink } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const { userData, setContext } = useContext(AppContext);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [noCredentials, setNoCredentials] = useState<string>("");
    const [userLoggedIn, setUserLoggedIn] = useState<string>("");
    const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
    const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const updateForm = (prop: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [prop]: e.target.value,
        });
    };

    useEffect(() => {
        if (userData) {
            setUserLoggedIn(
                `Welcome back, ${userData.firstName} ${userData.lastName}`
            );
        }
    }, [userData, setUserLoggedIn]);

    const login = async () => {
        setNoCredentials("");
        setInvalidEmail(false);
        setInvalidPassword(false);

        if (!form.email || !form.password) {
            setNoCredentials(
                "Enter your email and password to log in."
            );
            return;
        }
        setIsLoading(true);

        try {
            const credentials = await loginUser(form.email, form.password);
            if (credentials.user) {
                const snapshot = await getUserData(credentials.user.uid);
                if (snapshot) {
                    setContext && setContext({
                        user: credentials.user,
                        userData: snapshot,
                        channels: [], 
                        meetings: [],
                    });
                    navigate("/");
                }
            } else {
                setInvalidEmail(true);
                setInvalidPassword(true);
            }
        } catch (error) {
            const errorMessage = error as Error;
            if (errorMessage.message.includes("email")) {
                setInvalidEmail(true);
            } else if (errorMessage.message.includes("password")) {
                setInvalidPassword(true);
            } else {
                setNoCredentials("Incorrect email or password. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            login();
        }
    };

    return (
        <VStack spacing={4} width="full" maxW="md" margin="auto" mt={10}>
            <Box textAlign="center">
                <Text fontSize="2xl">{userLoggedIn ? userLoggedIn : 'Login'}</Text>
            </Box>
            {userData ? (
                <>
                    <Text>Let's chat, schedule and attend meetings.</Text>
                    <ChakraLink as={Link} to="/profile">Access your User Profile</ChakraLink>
                </>
            ) : (
                <Box minHeight="100vh">
                    <FormControl id="email">
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={updateForm("email")}
                            onKeyDown={handleKeyPress}
                            isInvalid={invalidEmail}
                        />
                    </FormControl>
                    <FormControl id="password" mt={2}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={updateForm("password")}
                            onKeyDown={handleKeyPress}
                            isInvalid={invalidPassword}
                        />
                    </FormControl>
                    {noCredentials && <Text color="red.500" dangerouslySetInnerHTML={{ __html: noCredentials.replace('login', '<a href="/login">login</a>') }} />}
                    {isLoading ? (
                        <Button isLoading colorScheme="teal" size="lg" fontSize="md" mt={3}>
                            Logging in...
                        </Button>
                    ) : (
                        <Button onClick={login} colorScheme="teal" size="lg" fontSize="md" mt={3}>
                            Log in
                        </Button>
                    )}
                    <Text mt={2}>You do not have an account? <ChakraLink as={Link} to="/register">Register</ChakraLink></Text>
                </Box>
            )}
        </VStack>
    );
    
};

export default Login;