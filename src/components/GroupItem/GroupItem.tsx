import React from 'react';
import { Link } from 'react-router-dom';
import type { Group } from '../../types/Group';
import styles from './GroupItem.module.css';


interface GroupItemProps {
    group: Group;
}

const GroupItem: React.FC<GroupItemProps> = ({ group }) => {
    return (
        <Link to={`/groups/${group.id}`} className={styles.groupItemLink}>
            <div className={styles.groupItem}>
                <h3 className={styles.groupName}>{group.name}</h3>
                <p className={styles.groupMeta}>
                    Owned by: {group.owner.username} | Members: {group.members.length}
                </p>
                <p className={styles.groupDate}>
                    Created: {new Date(group.created_at).toLocaleDateString()}
                </p>
            </div>
        </Link>
    );
};

export default GroupItem;