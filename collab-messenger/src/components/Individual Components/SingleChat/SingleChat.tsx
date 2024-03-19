import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getUserData } from "../../../services/user-services";
import { useNavigate } from "react-router-dom";


const SingleChat: React.FC = ({ userId, chatId }) => {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUserData(userId).then(setUser);
    }, [userId]);

    const onClickChat = () => {
        navigate(`${chatId}`);
    }

    return user && (
        <>
        <Button backgroundColor="navy" color="white" onClick={onClickChat} _hover={{ bg: "blue" }} mb={2}>
            {user.handle}
        </Button>
        <br />
        </>
    );
}

export default SingleChat;