import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { updateUserDetails } from '../../services/user-services';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Tag, TagLabel, TagLeftIcon, TagRightIcon, Tooltip, Spacer } from '@chakra-ui/react';
import { EditIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

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
    setFormError('');
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
    <Box p={5} shadow="md" borderWidth="1px" bg="gray.50" borderRadius="lg" minHeight="100vh">
      <VStack spacing={4}>
        <Heading as="h2" size="lg" color="teal.500">Edit Profile</Heading>
        <FormControl id="firstName">
          <FormLabel>First Name</FormLabel>
          <Input name="firstName" value={userInfo.firstName} onChange={handleInputChange} placeholder="First Name" bg="teal.100" />
        </FormControl>
        <Spacer height="20px"/>
        <FormControl id="lastName">
          <FormLabel>Last Name</FormLabel>
          <Input name="lastName" value={userInfo.lastName} onChange={handleInputChange} placeholder="Last Name" bg="teal.100" />
        </FormControl>
        <Spacer height="20px"/>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input name="email" value={userInfo.email} onChange={handleInputChange} placeholder="Email" bg="teal.100" />
        </FormControl>
        <Spacer height="20px"/>
        {formError && (
            <Tooltip label={formError} aria-label="A tooltip">
                <Tag size="lg" variant="solid" colorScheme="red">
                    <TagLeftIcon boxSize="12px" as={WarningIcon} />
                    <TagLabel>Error</TagLabel>
                    <TagRightIcon boxSize="16px" as={WarningIcon} />
                </Tag>
            </Tooltip>
        )}
        {updateError && (
            <Tooltip label="Failed to update profile." aria-label="A tooltip">
                <Tag size="lg" variant="solid" colorScheme="red">
                    <TagLeftIcon boxSize="12px" as={WarningIcon} />
                    <TagLabel>Error</TagLabel>
                    <TagRightIcon boxSize="16px" as={WarningIcon} />
                </Tag>
            </Tooltip>
        )}
        {updateSuccess && (
            <Tooltip label="Profile updated successfully!" aria-label="A tooltip">
                <Tag size="lg" variant="solid" colorScheme="green">
                    <TagLeftIcon boxSize="12px" as={CheckCircleIcon} />
                    <TagLabel>Status</TagLabel>
                    <TagRightIcon boxSize="16px" as={CheckCircleIcon} />
                </Tag>
            </Tooltip>
        )}
        <Button leftIcon={<EditIcon />} colorScheme="teal" variant="outline" onClick={saveChanges}>Save Changes</Button>
        <Button leftIcon={<EditIcon />} colorScheme="teal" variant="ghost" onClick={goBack}>Back</Button>
      </VStack>
    </Box>
  );
};

export default EditProfile;
