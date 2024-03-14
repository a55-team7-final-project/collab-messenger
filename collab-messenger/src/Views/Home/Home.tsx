// import { FC, useContext } from 'react';
// import { AppContext } from '../../content/AppContext';

// const Home: FC = () => {
//     const { userData } = useContext(AppContext);

//     return (
//         <div>
//             <h1>Hello, {userData?.firstName} {userData?.lastName}</h1>
//         </div>
//     );
// }

// export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase-setup';
import AllGroups from '../../components/Group Components/AllGroups/AllGroups';
import UserSearch from '../../components/User Page/UsersSearch';

const Home: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      <h1>Welcome to Collab Messenger</h1>
      {user ? (
        <>
        <p>You are logged in. Go to your <Link to="/profile">Profile</Link></p>
        <UserSearch />
        <AllGroups/>
        </>
        
      ) : (
        <p>You are not logged in. <Link to="/login">Login</Link> or <Link to="/register">Register</Link></p>
      )}
    </div>
  );
};

export default Home;
