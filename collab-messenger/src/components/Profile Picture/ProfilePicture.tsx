import { useState } from 'react';
import { uploadImage, saveProfilePictureUrl } from '../../services/user-services';
import { Button } from '@chakra-ui/react';

interface ProfilePictureProps {
    userId: string;
    imageUrl: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ userId, imageUrl }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(imageUrl);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };


    const handleUpload = async () => {
        if (selectedFile) {
            const url = await uploadImage(userId, selectedFile);
            setCurrentImageUrl(url);

            await saveProfilePictureUrl(userId, url);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <Button onClick={handleUpload}>Upload</Button>
            {currentImageUrl && <img src={currentImageUrl} alt="Profile" />}
        </div>
    );
};

export default ProfilePicture;