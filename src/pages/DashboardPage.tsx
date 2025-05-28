import React, { useEffect } from 'react';
import { useGroupStore } from '../store/groupStore';
import GroupItem from '../components/GroupItem/GroupItem';
import styles from './DashboardPage.module.css';


const DashboardPage: React.FC = () => {
    const groups = useGroupStore((state) => state.groups);
    const isLoading = useGroupStore((state) => state.isLoading);
    const error = useGroupStore((state) => state.error);
    const fetchGroups = useGroupStore((state) => state.fetchGroups);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    if (isLoading) {
        return <div className={styles.loadingMessage}>Loading your groups...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>Error fetching groups: {error}</div>;
    }


    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.title}>Your Groups</h1>

            {groups.length === 0 ? (
                <p className={styles.noGroupsMessage}>
                    You are not part of any groups yet. Why not create one?
                </p>
            ) : (
                <div className={styles.groupList}>
                    {groups.map((group) => (
                        <GroupItem key={group.id} group={group} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;