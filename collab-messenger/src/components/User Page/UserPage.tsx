import { useEffect, useState, useContext } from 'react';
import { getUserByHandle, uploadImage, updateUserDetails } from '../../services/user-services';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Box, Button, Flex, Image, Input, Stack, Text, VStack, Alert, AlertIcon, Avatar, Heading, Tag, TagLabel, TagLeftIcon, TagRightIcon, Tooltip, Spacer } from '@chakra-ui/react';
import { EditIcon, AttachmentIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

interface UserPageProps {
    userId: string;
}

const UserPage: React.FC<UserPageProps> = () => {
    const { userData } = useContext(AppContext);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const [selectedPhotoURL, setSelectedPhotoURL] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if (userData) {
                const userProfile = await getUserByHandle(userData.handle);
                if (userProfile.exists()) {
                    const profileData = userProfile.val();
                    if (profileData.photoURL) {
                        setPhotoURL(profileData.photoURL);
                    }
                }
            }
        };

        fetchData();
    }, [userData]);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedPhotoURL(URL.createObjectURL(e.target.files[0]));
            setStatusMessage(null);
            setErrorMessage(null);
    
            try {
                if (userData) {
                    const downloadURL = await uploadImage(userData.handle, e.target.files[0]);
                    console.log("File available at", downloadURL);
                    await updateUserDetails(userData.handle, { photoURL: downloadURL || '' });
                    setPhotoURL(downloadURL || '');
                    setSelectedPhotoURL(null);
                    setStatusMessage('Photo uploaded successfully!');
                }
            } catch (error) {
                console.error("Error uploading the file", error);
                setErrorMessage('Error uploading the file');
            }
        }
    };

    if (!userData) {
        return <Box>Loading...</Box>;
    }

   
return (
    <Flex direction="column" align="center" justify="center" p={5} bg="teal.50" borderRadius="lg" boxShadow="md" minHeight="100vh">
        <Avatar size="2xl" src={selectedPhotoURL || photoURL || "https://firebasestorage.googleapis.com/v0/b/forumgiphys.appspot.com/o/users%2Fdefault.jpg?alt=media&token=dfc8e521-58ee-477f-8990-28c5f9465172"} mb={4} />
        <Heading as="h2" size="lg">{userData.handle}</Heading>
        <VStack spacing={5} align="start" mt={5}>
            <Tag size="lg" variant="solid" colorScheme="teal">
                <TagLeftIcon boxSize="12px" as={AttachmentIcon} />
                <TagLabel>Username: {userData.handle}</TagLabel>
            </Tag>
            <Spacer height="20px"/>
            <Tag size="lg" variant="solid" colorScheme="teal">
                <TagLeftIcon boxSize="12px" as={AttachmentIcon} />
                <TagLabel>Email: {userData.email}</TagLabel>
            </Tag>
            <Spacer height="20px"/>
            <Tag size="lg" variant="solid" colorScheme="teal">
                <TagLeftIcon boxSize="12px" as={AttachmentIcon} />
                <TagLabel>First Name: {userData.firstName}</TagLabel>
            </Tag>
            <Spacer height="20px"/>
            <Tag size="lg" variant="solid" colorScheme="teal">
                <TagLeftIcon boxSize="12px" as={AttachmentIcon} />
                <TagLabel>Last Name: {userData.lastName}</TagLabel>
            </Tag>
        </VStack>
        <Button leftIcon={<EditIcon />} colorScheme="teal" onClick={() => navigate("/profile/edit")} mt={5}>
            Edit Profile
        </Button>
        <Stack direction="row" spacing={4} align="center" mt={5}>
            <Input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e)} style={{ display: 'none' }} id="fileUpload" />
            <label htmlFor="fileUpload">
                <Button as="span" leftIcon={<AttachmentIcon />} colorScheme="teal">Choose File</Button>
            </label>
        </Stack>
        {statusMessage && (
            <Tooltip label={statusMessage} aria-label="A tooltip">
                <Tag size="lg" variant="solid" colorScheme="green">
                    <TagLeftIcon boxSize="12px" as={CheckCircleIcon} />
                    <TagLabel>Status</TagLabel>
                    <TagRightIcon boxSize="16px" as={CheckCircleIcon} />
                </Tag>
            </Tooltip>
        )}
        {errorMessage && (
            <Tooltip label={errorMessage} aria-label="A tooltip">
                <Tag size="lg" variant="solid" colorScheme="red">
                    <TagLeftIcon boxSize="12px" as={WarningIcon} />
                    <TagLabel>Error</TagLabel>
                    <TagRightIcon boxSize="16px" as={WarningIcon} />
                </Tag>
            </Tooltip>
        )}
    </Flex>
);

};

export default UserPage;
