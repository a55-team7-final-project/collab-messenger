import { useEffect, useState } from 'react';
import { getUserData } from '../../services/user-services';
import ProfilePicture from '../Profile Picture/ProfilePicture';
import { User } from '../../types/types';
import { useNavigate } from 'react-router-dom';

interface UserPageProps {
    userId: string;
}

const UserPage: React.FC<UserPageProps> = ({ userId }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserData(userId);
            setUserData(data);
        };

        fetchUserData();
    }, [userId]);

    return (
        <div>
            {userData ? (
                <>
                    <button onClick={() => navigate(-1)}>Go Back</button>
                    <h1>{userData.firstName} {userData.lastName}</h1>
                    <ProfilePicture userId={userId} />
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserPage;