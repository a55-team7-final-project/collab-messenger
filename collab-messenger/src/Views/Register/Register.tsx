import { useState } from "react";
import 'firebase/auth';
import { registerUser, validateEmail, validatePassword } from "../../services/authentication-services";
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
    });
    const [userExists, setUserExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [noCredentials, setNoCredentials] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const updateForm = (prop: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [prop]: e.target.value,
        });
    }

    const register = async () => {
        setNoCredentials(false);
        setErrorMessage(null);

        if (!form.email || !form.password) {
            setNoCredentials(true);
            return console.log("Please provide the requested details in order to sign up.");
        }

        if (!validateEmail(form.email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(form.password)) {
            setErrorMessage('Your password does not meet the requirements. It should be more than 5 characters long.');
            return;
        }

        try {
            const user = await getUserByHandle(form.username);
            if (user) {
                setUserExists(true);
                return console.log(`User with handle ${form.username} already exists. Please choose another username.`);
            }
            const credentials = await registerUser(form.email, form.password) as { user: { uid: string } };
            navigate('/');
            await createUserHandle(form.username, credentials.user.uid, form.email, form.firstName, form.lastName);
        } catch (error) {
            setEmailExists(true);
            setErrorMessage((error as Error).message);
        }
    }

    return (
        <div className="register-container">
            <div className="register-header">
                <h1>Register</h1>
            </div>
            <div className="register-form">
                <label htmlFor="firstName"></label><input value={form.firstName} onChange={updateForm('firstName')} type="text" name="firstName" id="firstName" placeholder="Enter first name" />
                <label htmlFor="lastName"></label><input value={form.lastName} onChange={updateForm('lastName')} type="text" name="lastName" id="lastName" placeholder="Enter last name" />
                <label htmlFor="username"></label><input value={form.username} onChange={updateForm('username')} type="text" name="username" id="username" placeholder="Enter username" />
                <label htmlFor="email"></label><input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" placeholder="Enter email" />
                <label htmlFor="password"></label><input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" placeholder="Enter password" />
                {userExists && <p>User with that username already exists. Please choose another username.</p>}
                {emailExists && <p>Email is already being used. Go to Login page or try another email.</p>}
                {noCredentials && <p>Please provide the requested details in order to sign up.</p>}
                {errorMessage && <p>{errorMessage}</p>}
                <button onClick={register}>Register</button>
            </div>
        </div>
    );    
}


export default Register;
