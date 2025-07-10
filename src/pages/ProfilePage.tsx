import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import styles from './FormPageLayout.module.css';


const ProfilePage: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const updateProfile = useAuthStore((state) => state.updateProfile);
    const isUpdatingProfile = useAuthStore((state) => state.isUpdatingProfile);
    const updateProfileError = useAuthStore((state) => state.updateProfileError);

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
        }
    }, [user]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage(null);

        const payload = {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
        };

        const success = await updateProfile(payload);
        if (success) {
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>{user.username}'s Profile</h1>

            <div className={styles.profileInfo}>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.formSubtitle}>Edit Your Information</h2>
                <Input
                    label="First Name"
                    type="text"
                    id="profile-firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isUpdatingProfile}
                />
                <Input
                    label="Last Name"
                    type="text"
                    id="profile-lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isUpdatingProfile}
                />

                {updateProfileError && <p className={styles.errorMessage}>{updateProfileError}</p>}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

                <Button type="submit" isLoading={isUpdatingProfile} disabled={isUpdatingProfile}>
                    Update Profile
                </Button>
            </form>
        </div>
    );
};

export default ProfilePage;