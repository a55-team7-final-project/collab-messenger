import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../../context/AppContext";
import SingleChat from "../SingleChatText/SingleChat";
import { onValue, ref } from "firebase/database";
import { db } from "../../../config/firebase-setup";
import { getUserData } from "../../../services/user-services";

const AllChats: React.FC = () => {
    const { userData } = useContext(AppContext);
    const [allChats, setAllChats] = useState<any[] | null>(null);

    useEffect(() => {
        if (userData) {
            const chatsRef = ref(db, `users/${userData.uid}/messages`);
            const unsubscribe = onValue(chatsRef, async (snapshot) => {
                if (snapshot.exists()) {
                    const chats = await Promise.all(Object.entries(snapshot.val()).map(async ([key, value]) => {
                        const user = await getUserData(key); // fetch the user data based on userId
                        return {
                            id: key,
                            ...value,
                            createdOn: new Date(value.createdOn),
                            user, // add the user data to the chat object
                        };
                    }));
                    setAllChats(chats);
                } else {
                    setAllChats([]);
                }
            });
            return () => unsubscribe();
        }
    }, [userData]);
    

    return allChats && userData && (
        <>
            {allChats.map((chat, index) => {
                return <SingleChat key={index} chat={chat} user={chat.user} /> // pass user prop to SingleChat
            })}
        </>
    )
}

export default AllChats;