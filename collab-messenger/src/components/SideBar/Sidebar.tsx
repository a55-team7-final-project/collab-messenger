// import React, { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { auth } from '../../config/firebase-setup';
// import { AppContext } from '../../context/AppContext';
// import { Button, Grid, Input } from '@chakra-ui/react';

// const Header: React.FC = () => {
//   const { user, setContext } = useContext(AppContext);
//   const navigate = useNavigate();

//   const logOut = async () => {
//     await auth.signOut();
//     if (setContext) {
//       setContext({ user: null, userData: null });
//     }
//     navigate('/home');
//   }

//   return (
//     <header>
//       <div> 
//         {user ? (
//           <Grid templateColumns="1fr auto auto auto" mt={'20px'} justifyContent="flex-end" justifyItems="end" alignItems="center" mr='50px' mb='20px'>
//             <Button onClick={logOut} border="1px" color="blue" w="80px" ml='50px'>Logout</Button>
//           </Grid>
//         ) : (
//           <>
//             <Link to="/register"><Button>Register</Button></Link>
//             <Link to="/login"><Button>Login</Button></Link>
//           </>
//         )}
//       </div> 
//     </header>
//   );
// };

// export default Header;


// export default Sidebar;

// import React, { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Box, VStack, Text, IconButton, useColorMode, useColorModeValue, Button } from '@chakra-ui/react';
// import { FaSteam, FaComments, FaCalendar, FaSun, FaMoon, FaSmile } from 'react-icons/fa';
// import { auth } from '../../config/firebase-setup';
// import { AppContext } from '../../context/AppContext';
// import AllGroups from '../Group Components/AllGroups/AllGroups';
// import CreateGroup from '../Group Components/CreateGroup/CreateGroup';
// import Users from '../User Page/UsersSearch';
// import UserChatDetailed from '../Individual Components/IndividualDetailed/UserChatDetailed';

// const Sidebar: React.FC = () => {
//   const { toggleColorMode } = useColorMode();
//   const colorMode = useColorModeValue('light', 'dark');
//   const { user, setContext } = useContext(AppContext);
//   const navigate = useNavigate();

//   const logOut = async () => {
//     await auth.signOut();
//     if (setContext) {
//       setContext({ user: null, userData: null });
//     }
//     navigate('/home');
//   };

//   return (
//     <Box
//       bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
//       w="250px"
//       h="100vh"
//       p="4"
//       boxShadow="md"
//       position="fixed" 
//       left="0"
//       top="0" 
//     >
//       <VStack spacing={4}>
//         <Text fontSize="xl" fontWeight="bold">Collab Messenger</Text>
//         <IconButton as={Link} to="/groups" aria-label="Teams" icon={<FaSteam />} variant="ghost" color="teal.500" />
//         <IconButton as={Link} to="/chats" aria-label="Chats" icon={<FaComments />} variant="ghost" color="teal.500" />
//         <IconButton as={Link} to="/calendar" aria-label="Calendar" icon={<FaCalendar />} variant="ghost" color="teal.500" />
//         <IconButton aria-label="Toggle Dark Mode" icon={colorMode === 'light' ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} variant="ghost" color="teal.500" />
//         {user ? (
//           <Button onClick={logOut} variant="ghost" color="teal.500">Logout</Button>
//         ) : (
//           <>
//             <Link to="/register"><Button variant="ghost" color="teal.500">Register</Button></Link>
//             <Link to="/login"><Button variant="ghost" color="teal.500">Login</Button></Link>
//           </>
//         )}
//         <AllGroups />
//         <CreateGroup /> 
//         <Users /> 
//         <UserChatDetailed />
//       </VStack>
//     </Box>
//   );
// };

// export default Sidebar;

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, VStack, Text, IconButton, useColorMode, useColorModeValue, Button } from '@chakra-ui/react';
import { FaSteam, FaComments, FaCalendar, FaSun, FaMoon, FaHome, FaUser, } from 'react-icons/fa';
import { auth } from '../../config/firebase-setup';
import { AppContext } from '../../context/AppContext';
// import UserChatDetailed from '../Individual Components/IndividualDetailed/UserChatDetailed';
// import Users from '../User Page/UsersSearch';

const Sidebar: React.FC = () => {
  const { toggleColorMode } = useColorMode();
  const colorMode = useColorModeValue('light', 'dark');
  const { user, setContext } = useContext(AppContext);
  const navigate = useNavigate();

  const logOut = async () => {
    await auth.signOut();
    if (setContext) {
      setContext({ user: null, userData: null });
    }
    navigate('/');
  };

  return (
    <Box
      bg={colorMode === 'light' ? 'gray.100' : 'darkblue.800'}
      w="250px"
      h="100vh"
      p="4"
      boxShadow="md"
      position="fixed"
      left="0"
      top="0"
    >
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">Collab Messenger</Text>
        <Link to="/">
    <IconButton aria-label="Home" icon={<FaHome />} variant="ghost" color="teal.500" />
    <Text>Home</Text>
  </Link>
  <Link to="/profile">
    <IconButton aria-label="Profile" icon={<FaUser />} variant="ghost" color="teal.500" />
    <Text>My Profile</Text>
  </Link>
        <Link to="/groups">
          <IconButton aria-label="Teams" icon={<FaSteam />} variant="ghost" color="teal.500" />
          <Text>Teams</Text>
        </Link>
        <Link to="/chats">
          <IconButton aria-label="Chats" icon={<FaComments />} variant="ghost" color="teal.500" />
          <Text>Chats</Text>
        </Link>
        <Link to="/calendar">
          <IconButton aria-label="Calendar" icon={<FaCalendar />} variant="ghost" color="teal.500" />
          <Text>Calendar</Text>
        </Link>
        <IconButton aria-label="Toggle Dark Mode" icon={colorMode === 'light' ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} variant="ghost" color="teal.500" />
        {user ? (
          <Button onClick={logOut} variant="ghost" color="teal.500">Logout</Button>
        ) : (
          <>
            <Link to="/register"><Button variant="ghost" color="teal.500">Register</Button></Link>
            <Link to="/login"><Button variant="ghost" color="teal.500">Login</Button></Link>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default Sidebar;