import React, { useContext, useEffect, useState } from "react";
import { loginUser } from "../../services/authentication-services";
import { AppContext } from "../../context/AppContext";
import { getUserData } from "../../services/user-services";
import { Link } from "react-router-dom";

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
                "Enter your email and password to log in. If you don't have an account, register."
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
                    });
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
        <div className="register-container">
            <div className="register-header">
                <h1>{userLoggedIn ? userLoggedIn : 'Login'}</h1>
            </div>
            <div className="register-form">
                {userData ? (
                    <>
                        <p>Let's chat, schedule and attend meetings.</p>
                        <p>Access your <Link to="/profile">User Profile</Link>.</p>
                    </>
                ) : (
                    <>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={updateForm("email")}
                            onKeyDown={handleKeyPress}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={updateForm("password")}
                            onKeyDown={handleKeyPress}
                        />
                        {invalidEmail && <p>Invalid email</p>}
                        {invalidPassword && <p>Invalid password</p>}
                        {noCredentials && <p dangerouslySetInnerHTML={{ __html: noCredentials.replace('register', '<a href="/register">register</a>') }} />}
                        {isLoading && <p>Loading...</p>}
                        <button onClick={login}>Login</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;