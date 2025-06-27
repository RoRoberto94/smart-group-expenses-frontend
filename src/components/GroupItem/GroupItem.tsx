import React from 'react';
import { Link } from 'react-router-dom';
import type { Group } from '../../types/Group';
import styles from './GroupItem.module.css';
import Button from '../Button/Button';
import { useAuthStore } from '../../store/authStore';


interface GroupItemProps {
    group: Group;
    onEditGroup: (group: Group) => void;
    onDeleteGroup: (groupId: number) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onEditGroup, onDeleteGroup }) => {
    const currentUser = useAuthStore((state) => state.user);
    const isOwner = currentUser?.id === group.owner.id;

    return (
        <div className={styles.groupItem}>
            <Link to={`/groups/${group.id}`} className={styles.groupNameLink}>
                <h3 className={styles.groupName}>{group.name}</h3>
            </Link>
            <p className={styles.groupMeta}>
                Owned by: {group.owner.username} | Members: {group.members.length}
            </p>
            <p className={styles.groupDate}>
                Created: {new Date(group.created_at).toLocaleDateString()}
            </p>

            {isOwner && (
                <div className={styles.groupActions}>
                    <Button
                        onClick={() => onEditGroup(group)}
                        variant="secondary"
                        className={styles.actionButton}
                    >
                        Edit Name
                    </Button>
                    <Button
                        onClick={() => onDeleteGroup(group.id)}
                        variant="secondary"
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                    >
                        Delete Group
                    </Button>
                </div>
            )}
        </div>
    );
};

export default GroupItem;