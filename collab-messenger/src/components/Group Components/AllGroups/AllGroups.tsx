import { useContext, useEffect, useState } from "react"
import { getAllGroups } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleGroup from "../SingleGroup/SingleGroup";
import CreateGroup from "../CreateGroup/CreateGroup";
import { Group } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { db } from "../../../config/firebase-setup";
import { Box, Heading, Stack, Button } from "@chakra-ui/react";


interface AllGroupsProps { }

const AllGroups: React.FC<AllGroupsProps> = () => {
    const { userData } = useContext(AppContext);
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    const navigate = useNavigate();

    const onClick = (groupId: string) => {
        navigate(`/groups/${groupId}`);
    }

    useEffect(() => {
        if (userData) {
            const groupsRef = ref(db, 'groups');
            const unsubscribe = onValue(groupsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const groups = Object.entries(snapshot.val()).map(([key, value]) => ({
                        id: key,
                        ...value,
                        createdOn: new Date(value.createdOn),
                        channels: value.channels ? Object.keys(value.channels) : [],
                        members: value.members ? Object.keys(value.members) : []
                    }));
                    setAllGroups(groups);
                } else {
                    setAllGroups([]);
                }
            });

            return () => unsubscribe();
        }
    }, [userData]);


    return (
        <Box maxW="xl" mx="auto" p={8}>
            <Heading mb={4}>Groups</Heading>
            <CreateGroup />
            {userData && (
                <Stack spacing={5} mt={6}>
                    {allGroups.filter(group => group.members.includes(userData.handle)).map((group) => (
                        <SingleGroup
                            key={group.id}
                            group={group}
                            currentUser={userData}
                            onClick={onClick}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default AllGroups;