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

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Text,
  IconButton,
  Button,
  Avatar,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { FaSteam, FaComments, FaCalendar, FaSun, FaMoon, FaHome } from 'react-icons/fa';
import { RiFlashlightFill } from 'react-icons/ri';
import { AppContext } from '../../context/AppContext';
import { auth } from '../../config/firebase-setup';
import { useEffect, useState } from 'react';
import { getUserByHandle } from '../../services/user-services';
import { User } from '../../types/types';

const Sidebar: React.FC = () => {
  const { toggleColorMode } = useColorMode();
  const colorMode = useColorModeValue('light', 'dark');
  const { user, setContext } = useContext(AppContext);
  const navigate = useNavigate();
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userProfile = await getUserByHandle(user.displayName || 'User');
        if (userProfile && userProfile.photoURL) {
          setPhotoURL(userProfile.photoURL);
        }
      }
    };

    fetchData();
  }, [user]);

  const logOut = async () => {
    await auth.signOut();
    if (setContext) {
      setContext({ user: null, userData: null });
    }
    navigate('/');
  };

  return (
    <>
      {/* Full-size Sidebar */}
      <Box
        display={{ base: 'none', md: 'block' }}
        bg={useColorModeValue('gray.100', 'darkblue.800')}
        w={{ base: '100%', md: '250px' }}
        h="100vh"
        p="4"
        boxShadow="md"
        position="fixed"
        left="0"
        top="0"
      >
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold">UnityChat</Text>
          <Link to="/">
            <IconButton aria-label="Home" icon={<FaHome />} variant="ghost" color="teal.500" />
            <Text>Home</Text>
          </Link>
          <Link to="/groups">
            <IconButton aria-label="Groups" icon={<FaSteam />} variant="ghost" color="teal.500" />
            <Text>Groups</Text>
          </Link>
          <Link to={`/chats`}>
            <IconButton aria-label="Chats" icon={<FaSteam />} variant="ghost" color="teal.500" />
            <Text>Chats</Text>
          </Link>
          {/* <Link to="/calendar">
            <IconButton aria-label="Calendar" icon={<FaCalendar />} variant="ghost" color="teal.500" />
            <Text>Calendar</Text>
          </Link> */}
          <IconButton aria-label="Toggle Dark Mode" icon={colorMode === 'light' ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} variant="ghost" color="teal.500" />
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                rounded="full"
                variant="ghost"
                color="teal.500"
                _hover={{ textDecoration: 'none' }}
              >
                <Avatar size="sm" name={user.displayName || "User"} src={user.photoURL || undefined} />
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/profile">My Profile</MenuItem>
                <MenuItem onClick={logOut}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              {/* <Link to="/register"><Button variant="ghost" color="teal.500">Register</Button></Link>
              <Link to="/login"><Button variant="ghost" color="teal.500">Login</Button></Link> */}
            </>
          )}
        </VStack>
      </Box>
      {/* Mobile Sidebar */}
      <Box
        display={{ base: 'block', md: 'none' }}
        bg={useColorModeValue('gray.100', 'darkblue.800')}
        w="100%"
        h="60px"
        p="4"
        boxShadow="md"
        position="fixed"
        bottom="0"
        left="0"
        borderTopWidth="1px"
      >
        <HamburgerMenu />
      </Box>
    </>
  );
};

const HamburgerMenu: React.FC = () => {
  const { toggleColorMode } = useColorMode();
  const colorMode = useColorModeValue('light', 'dark');
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const logOut = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <VStack spacing={2}>
      <IconButton aria-label="Toggle Dark Mode" icon={colorMode === 'light' ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} variant="ghost" color="teal.500" />
      {user ? (
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            rounded="full"
            variant="ghost"
            color="teal.500"
            _hover={{ textDecoration: 'none' }}
          >
            <Avatar size="sm" name={user.displayName || "User"} src={user.photoURL || undefined} />
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} to="/profile">My Profile</MenuItem>
            <MenuItem onClick={logOut}>Logout</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <>
          {/* <Link to="/register"><Button variant="ghost" color="teal.500">Register</Button></Link> */}
          {/* <Link to="/login"><Button variant="ghost" color="teal.500">Login</Button></Link> */}
        </>
      )}
    </VStack>
  );
};

export default Sidebar;