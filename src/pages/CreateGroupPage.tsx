import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useGroupStore } from '../store/groupStore';
import styles from './FormPageLayout.module.css';


const CreateGroupPage: React.FC = () => {
    const [groupName, setGroupName] = useState('');

    const createGroup = useGroupStore((state) => state.createGroup);
    const isCreating = useGroupStore((state) => state.isCreating);
    const createError = useGroupStore((state) => state.createError);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!groupName.trim()) {
            alert("Group name cannot be empty.");
            return;
        }

        const newGroup = await createGroup({ name: groupName });

        if (newGroup) {
            navigate('/dashboard');
        }
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Create New Group</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Group Name"
                    type="text"
                    id="group-name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    disabled={isCreating}
                    required
                />
                {createError && <p className={styles.errorMessage}>{createError}</p>}
                <Button type="submit" isLoading={isCreating} disabled={isCreating}>
                    Create Group
                </Button>
            </form>
        </div>
    );
};

export default CreateGroupPage;