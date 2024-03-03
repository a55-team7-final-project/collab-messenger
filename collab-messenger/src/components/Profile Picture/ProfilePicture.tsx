import { useState } from 'react';
import { uploadImage } from '../../services/user-services';
import { Button } from '@chakra-ui/react';

interface ProfilePictureProps {
    userId: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ userId }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const url = await uploadImage(userId, selectedFile);
            setImageUrl(url);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <Button onClick={handleUpload}>Upload</Button>
            {imageUrl && <img src={imageUrl} alt="Profile" />}
        </div>
    );
};

export default ProfilePicture;