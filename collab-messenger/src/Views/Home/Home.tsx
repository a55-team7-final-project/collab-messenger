import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase-setup';
import AllGroups from '../../components/Group Components/AllGroups/AllGroups';
import UserSearch from '../../components/User Page/UsersSearch';
import { AppContext } from '../../context/AppContext';
import { Box, Heading, Text, Button, VStack, useColorModeValue, Center, Container, ScaleFade } from '@chakra-ui/react';
// import { useEffect } from 'react';
// import messaging from '@react-native-firebase/messaging';


const Home: React.FC = () => {
  const [user] = useAuthState(auth);
  const { userData } = React.useContext(AppContext);
  const color = useColorModeValue('teal.500', 'teal.200');  

  // useEffect(() => {
  //   if (user) {
  //     const unsubscribe = messaging().onMessage(async remoteMessage => {
  //       console.log('Message received:', remoteMessage);
  //       // Customize notification here
  //       const notificationTitle = 'New Message';
  //       const notificationOptions = {
  //         body: remoteMessage.notification.body,
  //         icon: '/firebase-logo.png'
  //       };

  //       if (!("Notification" in window)) {
  //         console.log("This browser does not support system notifications");
  //       }
  //       // Let's check whether notification permissions have already been granted
  //       else if (Notification.permission !== "denied") {
  //         Notification.requestPermission().then(function (permission) {
  //           // If the user accepts, let's create a notification
  //           if (permission === "granted") {
  //             new Notification(notificationTitle, notificationOptions);
  //           }
  //         });
  //       }
  //     });

  //     // Clean up the listener when the component is unmounted
  //     return () => unsubscribe();
  //   }
  // }, [user]); // Re-run this effect when the 'user' state changes

  return (
    <Container maxW="container.xl" p="4">
      <Center>
        <Heading as="h1" size="2xl" color={color}>
          Hello, {userData?.firstName} {userData?.lastName}
        </Heading>
      </Center>
      {user ? (
        <VStack spacing={8} align="stretch">
          <Text fontSize="xl">You are logged in. Go to your <Link to="/profile">Profile</Link></Text>
          <Box p="4" borderWidth={1} borderRadius="lg">
            <UserSearch />
          </Box>
          <Box p="4" borderWidth={1} borderRadius="lg" _hover={{ transform: "scale(1.05)" }} transition="all 0.2s">
            <ScaleFade initialScale={0.9} in={true}>
              <AllGroups/>
            </ScaleFade>
          </Box>
        </VStack>
      ) : (
        <VStack spacing={4} align="center">
          <Text fontSize="xl">You are not logged in.</Text>
          <Button as={Link} to="/login" colorScheme="teal" variant="outline">Login</Button>
          <Button as={Link} to="/register" colorScheme="teal">Register</Button>
        </VStack>
      )}
    </Container>
  );
};

export default Home;
