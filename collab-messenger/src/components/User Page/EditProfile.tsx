import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { updateUserDetails } from '../../services/user-services';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';

const EditProfile = () => {
  const { userData, setContext } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const navigate = useNavigate();
  const [updateError, setUpdateError] = useState(false);  
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (userData) {
      setUserInfo({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const saveChanges = async () => {
    if (!userInfo.firstName || !userInfo.lastName || !userInfo.email) {
      setFormError('Provide your First Name, Last Name and Email to update your profile.');
      return;
    }

    try {
      await updateUserDetails(userData?.handle, userInfo);
      setContext(prev => ({
        ...prev,
        userData: { ...prev.userData, ...userInfo },
      }));
      setUpdateSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (error) {
      setUpdateError(true);
    }
  };

  const goBack = () => {
    navigate('/profile')
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <VStack spacing={4}>
        <Text fontSize="2xl">Edit Profile</Text>
        <FormControl id="firstName">
          <FormLabel>First Name</FormLabel>
          <Input name="firstName" value={userInfo.firstName} onChange={handleInputChange} placeholder="First Name" />
        </FormControl>
        <FormControl id="lastName">
          <FormLabel>Last Name</FormLabel>
          <Input name="lastName" value={userInfo.lastName} onChange={handleInputChange} placeholder="Last Name" />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input name="email" value={userInfo.email} onChange={handleInputChange} placeholder="Email" />
        </FormControl>
        {formError && <Text color="red.500">{formError}</Text>}
        {updateError && <Text color="red.500">Failed to update profile.</Text>}
        {updateSuccess && <Text color="green.500">Profile updated successfully!</Text>}
        <Button colorScheme="teal" variant="outline" onClick={saveChanges}>Save Changes</Button>
        <Button colorScheme="teal" variant="ghost" onClick={goBack}>Back</Button>
      </VStack>
    </Box>
  );
};

export default EditProfile;
