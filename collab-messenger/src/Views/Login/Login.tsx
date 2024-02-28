import { useState } from "react";
import 'firebase/auth';
import { loginUser, validateEmail, validatePassword } from "../../services/authentication-services";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [noCredentials, setNoCredentials] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const updateForm = (prop: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [prop]: e.target.value,
        });
    }

    const login = async () => {
        if (!form.email || !form.password) {
            setNoCredentials(true);
            return console.log("Please provide the requested details in order to log in.");
        }

        if (!validateEmail(form.email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        if (!validatePassword(form.password)) {
            setErrorMessage('Your password does not meet the requirements.');
            return;
        }

        try {
            await loginUser(form.email, form.password) as { user: { uid: string } };
            navigate('/');
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    }

    return (
        <div className="login-container">
            <div className="login-header">
                <h1>Login</h1>
            </div>
            <div className="login-form">
                <label htmlFor="email"></label><input value={form.email} onChange={updateForm('email')} type="text" name="email" id="email" placeholder="Enter email" />
                <label htmlFor="password"></label><input value={form.password} onChange={updateForm('password')} type="password" name="password" id="password" placeholder="Enter password" />
                {noCredentials && <p>Please provide the requested details in order to log in.</p>}
                {errorMessage && <p>{errorMessage}</p>}
                <button onClick={login}>Login</button>
                <p>You do not have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );    
}

export default Login;