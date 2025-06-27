import React, { useState, useEffect } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { useGroupStore } from '../../store/groupStore';
import type { UpdateGroupNamePayload } from '../../services/groupService';
import type { Group } from '../../types/Group';
import styles from './EditGroupForm.module.css';


interface EditGroupFormProps {
    groupToEdit: Group;
    onGroupUpdated: () => void;
    onCancel: () => void;
}

const EditGroupForm: React.FC<EditGroupFormProps> = ({
    groupToEdit,
    onGroupUpdated,
    onCancel,
}) => {
    const [groupName, setGroupName] = useState(groupToEdit.name);

    const editGroupDetails = useGroupStore((state) => state.editGroupDetails);
    const isUpdatingGroup = useGroupStore((state) => state.isUpdatingGroup);
    const updateGroupError = useGroupStore((state) => state.updateGroupError);

    useEffect(() => {
        setGroupName(groupToEdit.name);
    }, [groupToEdit]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!groupName.trim()) {
            alert("Group name cannot be empty.")
            return;
        }

        if (groupName.trim() === groupToEdit.name) {
            onCancel();
            return;
        }

        const payload: UpdateGroupNamePayload = {
            name: groupName.trim(),
        };

        const updatedGroup = await editGroupDetails(groupToEdit.id, payload);

        if (updatedGroup) {
            onGroupUpdated();
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.formTitle}>Edit Group Name</h3>
            <Input
                label="New Group Name"
                type="text"
                id={`edit-group-name-${groupToEdit.id}`}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={isUpdatingGroup}
                required
            />
            {updateGroupError && <p className={styles.errorMessage}>{updateGroupError}</p>}
            <div className={styles.formActions}>
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="secondary"
                    disabled={isUpdatingGroup}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    isLoading={isUpdatingGroup}
                    disabled={isUpdatingGroup}
                >
                    Save Name
                </Button>
            </div>
        </form>
    );
};

export default EditGroupForm;