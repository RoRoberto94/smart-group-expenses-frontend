import React, { useState } from 'react';
import { useGroupStore } from '../../store/groupStore';
import Input from '../Input/Input';
import Button from '../Button/Button';
import styles from './ManageMembers.module.css';


interface ManageMembersProps {
    groupId: string | number;
}

const ManageMembers: React.FC<ManageMembersProps> = ({ groupId }) => {
    const [usernameToAdd, setUsernameToAdd] = useState('');

    const selectedGroup = useGroupStore((state) => state.selectedGroup);

    const addMember = useGroupStore((state) => state.addMember);
    const removeMember = useGroupStore((state) => state.removeMember);
    const isManagingMembers = useGroupStore((state) => state.isManagingMembers);
    const manageMembersError = useGroupStore((state) => state.manageMembersError);

    if (!selectedGroup) return null;

    const handleAddMemberSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!usernameToAdd.trim()) return;
        const success = await addMember(groupId, usernameToAdd.trim());
        if (success) {
            setUsernameToAdd('');
        }
    };

    const handleRemoveMemberClick = async (usernameToRemove: string) => {
        if (window.confirm(`Are you sure you want to remove ${usernameToRemove} from the group?`)) {
            await removeMember(groupId, usernameToRemove);
        }
    };

    return (
        <div className={styles.manageMembersContainer}>
            <h3 className={styles.sectionTitle}>Manage Members</h3>
            <form onSubmit={handleAddMemberSubmit} className={styles.addForm}>
                <Input
                    placeholder="Enter username to add"
                    type="text"
                    value={usernameToAdd}
                    onChange={(e) => setUsernameToAdd(e.target.value)}
                    disabled={isManagingMembers}
                />
                <Button
                    type="submit"
                    isLoading={isManagingMembers}
                    disabled={isManagingMembers || !usernameToAdd.trim()}
                >
                    Add Member
                </Button>
            </form>
            {manageMembersError && <p className={styles.errorMessage}>{manageMembersError}</p>}

            <h4 className={styles.listTitle}>Current Members:</h4>
            <ul className={styles.membersList}>
                {selectedGroup.members.map((member) => (
                    <li key={member.id} className={styles.memberItem}>
                        <span>{member.username} {member.id === selectedGroup.owner.id && '(Owner)'}</span>
                        {member.id !== selectedGroup.owner.id && (
                            <Button
                                onClick={() => handleRemoveMemberClick(member.username)}
                                variant="secondary"
                                className={styles.removeButton}
                                disabled={isManagingMembers}
                            >
                                Remove
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageMembers;