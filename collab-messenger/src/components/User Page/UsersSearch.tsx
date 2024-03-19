import { getAllUsers } from "../../services/user-services";
import { createChat } from "../../services/messages-services";
import { useState, useEffect } from 'react';
import { Box, Input, Text, Flex, Avatar } from "@chakra-ui/react";
import {User} from '../../types/types';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const UserSearch: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getAllUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Failed to fetch users: ", error);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        (user.handle && user.handle.includes(searchQuery)) ||
        (user.email && user.email.includes(searchQuery))
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setHasSearched(true);
    };

    const handleUserClick = async (userId: string) => {
    if (userData) {    
        const chatId = await createChat(userData.uid, userId); // create a new chat when a user is clicked before navigating to the chat page
        if (chatId) {
            navigate(`/user/${userId}/chats/${chatId}`);
        } 
    }
}

    return (
        <Box>
            <Input
                type="text"
                placeholder="Search by username or email"
                value={searchQuery}
                onChange={handleInputChange}
            />
            {searchQuery && filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                    <Box
                        key={user.uid}
                        onClick={() => handleUserClick(user.uid)}
                        p={5}
                        shadow="md"
                        borderWidth={1}
                        borderRadius="md"
                        _hover={{ bg: "teal.500", color: "white" }}
                        cursor="pointer"
                    >
                        <Flex align="center">
                            <Avatar name={user.handle} src={user.profilePicture} />
                            <Box ml="3">
                                <Text fontWeight="bold">
                                    {user.handle}
                                </Text>
                                <Text fontSize="sm">
                                    {user.email}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                ))
            ) : hasSearched && searchQuery ? (
                <Text>No such username or email. Try a different one!</Text>
            ) : null}
        </Box>
    );
    
}

export default UserSearch;