import { useState } from "react";
import 'firebase/auth';
import { registerUser, validateEmail, validatePassword, emailExist } from "../../services/authentication-services";
import { createUserHandle, getUserByHandle } from "../../services/user-services";
import './Register.css';
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, Link as ChakraLink } from "@chakra-ui/react";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
    });
    const [userExists, setUserExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [noCredentials, setNoCredentials] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const updateForm = (prop: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (prop === 'email') {
            setEmailExists(false);
        }
        setForm({
            ...form,
            [prop]: e.target.value,
        });
    }

    const register = async () => {
        setNoCredentials(false);
        setErrorMessage(null);

        if (!form.email || !form.password || !form.username || !form.firstName || !form.lastName) {
            setNoCredentials(true);
            setErrorMessage("Please provide the requested details in order to sign up.");
            return;
        }

        if (!validateEmail(form.email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(form.password)) {
            setErrorMessage('Your password does not meet the requirements. It should be more than 5 characters long.');
            return;
        }
        if (form.username.length < 5 || form.username.length > 35) {
            setErrorMessage('Username must be between 5 and 35 characters long.');
            return;
        }

        if (await emailExist(form.email)) {
            setEmailExists(true);
            setErrorMessage('This email is already in use. Choose another email.');
            return;
        }
        
        setIsLoading(true);

        try {
            const user = await getUserByHandle(form.username);
            if (user) {
                setUserExists(true);
                setErrorMessage(`Username ${form.username} already exists. Please choose another username.`);
                return;
            }
            const credentials = await registerUser(form.email, form.password) as { user: { uid: string } };
            
            navigate('/');
            await createUserHandle(form.username, credentials.user.uid, form.email, form.firstName, form.lastName, form.phoneNumber);
        } catch (error) {
            const errorMessage = (error as Error).message;
            if (errorMessage.includes('email')) {
                setEmailExists(true);
            }
            setErrorMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <VStack spacing={4} width="full" maxW="md" margin="auto" mt={10}>
            <Box textAlign="center">
                <Text fontSize="2xl">Register</Text>
            </Box>
            <Box>
                <FormControl id="firstName">
                    <FormLabel>First Name</FormLabel>
                    <Input value={form.firstName} onChange={updateForm('firstName')} placeholder="First Name" />
                </FormControl>
                <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input value={form.lastName} onChange={updateForm('lastName')} placeholder="Last Name" />
                </FormControl>
                <FormControl id="username">
                    <FormLabel>Username</FormLabel>
                    <Input value={form.username} onChange={updateForm('username')} placeholder="Username" />
                </FormControl>
                <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input value={form.email} onChange={updateForm('email')} placeholder="email@example.com" />
                </FormControl>
                <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input value={form.password} onChange={updateForm('password')} type="password" placeholder="Password" />
                </FormControl>
                <FormControl id="phoneNumber">
                    <FormLabel>Phone Number</FormLabel>
                    <Input value={form.phoneNumber} onChange={updateForm('phoneNumber')} placeholder="Phone Number (optional)" />
                </FormControl>
                {emailExists && <Text color="red.500">Email is already being used. Go to Login page or try another email.</Text>}
                {errorMessage && <Text color="red.500">{errorMessage}</Text>}
                {userExists && <Text color="red.500">{userExists}</Text>}
                {noCredentials && <Text color="red.500">{noCredentials}</Text>}
                {isLoading ? (
                    <Button isLoading colorScheme="teal" size="lg" fontSize="md">
                        Registering...
                    </Button>
                ) : (
                    <Button onClick={register} colorScheme="teal" size="lg" fontSize="md">
                        Register
                    </Button>
                )}
            </Box>
        </VStack>
    );
    
      
}


export default Register;