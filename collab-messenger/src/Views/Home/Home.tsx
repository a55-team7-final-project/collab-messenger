import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase-setup';

const Home: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      <h1>Welcome to Collab Messenger</h1>
      {user ? (
        <p>You are logged in. Go to your <Link to="/profile">Profile</Link></p>
      ) : (
        <p>You are not logged in. <Link to="/login">Login</Link> or <Link to="/register">Register</Link></p>
      )}
    </div>
  );
};

export default Home;