import { useState } from "react";
import 'firebase/auth';
import { registerUser, validateEmail, validatePassword, emailExist } from "../../services/authentication-services";
import { createUserHandle, getUserByHandle } from "../../services/user-services";
import './Register.css';
import { useNavigate } from "react-router-dom";

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
                setErrorMessage(`User with handle ${form.username} already exists. Please choose another username.`);
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
        <div className="register-container">
            <div className="register-header">
                <h1>Register</h1>
            </div>
            <div className="register-form">
                <label htmlFor="firstName">First Name</label>
                <input value={form.firstName} onChange={updateForm('firstName')} type="text" name="firstName" id="firstName" placeholder="First Name" />
                <label htmlFor="lastName">Last Name</label>
                <input value={form.lastName} onChange={updateForm('lastName')} type="text" name="lastName" id="lastName" placeholder="Last Name" />
                <label htmlFor="username">Username</label>
                <input value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" placeholder="Username" />
                <label htmlFor="email">Email</label>
                <input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" placeholder="email@example.com" />
                <label htmlFor="password">Password</label>
                <input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" placeholder="Password" />
                <label htmlFor="phoneNumber">Phone Number</label>
                <input value={form.phoneNumber} onChange={updateForm('phoneNumber')} type="text" name="phoneNumber" id="phoneNumber" placeholder="Phone Number (optional)" />
                {userExists && <p>User with that username already exists. Please choose another username.</p>}
                {emailExists && <p>Email is already being used. Go to Login page or try another email.</p>}
                {noCredentials && <p>Please provide the requested details in order to sign up.</p>}
                {errorMessage && <p>{errorMessage}</p>}
                {isLoading && <p>Loading...</p>}
                <button type="submit" disabled={isLoading} onClick={register}>Register</button>
            </div>
        </div>
    );
      
}


export default Register;