import React, { useEffect, useState } from 'react';
import { useGroupStore } from '../store/groupStore';
import GroupItem from '../components/GroupItem/GroupItem';
import styles from './DashboardPage.module.css';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';
import EditGroupForm from '../components/EditGroupForm/EditGroupForm';
import type { Group } from '../types/Group';


const DashboardPage: React.FC = () => {
    const groups = useGroupStore((state) => state.groups);
    const isLoading = useGroupStore((state) => state.isLoading);
    const error = useGroupStore((state) => state.error);
    const fetchGroups = useGroupStore((state) => state.fetchGroups);

    const removeGroup = useGroupStore((state) => state.removeGroup);
    const deleteGroupError = useGroupStore((state) => state.deleteGroupError);

    const [showEditGroupForm, setShowEditGroupForm] = useState(false);
    const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleEditGroupClick = (group: Group) => {
        setGroupToEdit(group);
        setShowEditGroupForm(true);
    };

    const handleDeleteGroupClick = async (groupId: number) => {
        if (window.confirm('Are you sure you want to delete this group and all its expenses? This action cannot be undone.')) {
            useGroupStore.setState({ deleteGroupError: null });
            const success = await removeGroup(groupId);
            if (success) {
                console.log('Group deleted successfully');
            } else {
                const errorMsg = useGroupStore.getState().deleteGroupError;
                alert(`Failed to delete group: ${errorMsg || 'Unknown error'}`);
            }
        }
    };

    const handleGroupUpdated = () => {
        setShowEditGroupForm(false);
        setGroupToEdit(null);
    };

    const handleCancelEditGroup = () => {
        setShowEditGroupForm(false);
        setGroupToEdit(null);
        useGroupStore.setState({ updateGroupError: null });
    };

    if (isLoading) {
        return <div className={styles.loadingMessage}>Loading your groups...</div>;
    }

    if (error && groups.length === 0) {
        return <div className={styles.errorMessage}>Error fetching groups: {error}</div>;
    }


    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.headerActions}>
                <h1 className={styles.title}>Your Groups</h1>
                <Link to="/groups/create" className={styles.createGroupLink}>
                    <Button variant="primary" className={styles.createGroupButton}>
                        + Create New Group
                    </Button>
                </Link>
            </div>

            {showEditGroupForm && groupToEdit && (
                <section className={styles.editGroupSection}>
                    <EditGroupForm
                        groupToEdit={groupToEdit}
                        onGroupUpdated={handleGroupUpdated}
                        onCancel={handleCancelEditGroup}
                    />
                </section>
            )}

            {deleteGroupError && <p className={styles.errorMessage}>Delete error: {deleteGroupError}</p>}
            {error && !deleteGroupError && <p className={styles.errorMessage}>Last fetch attempt failed: {error}</p>}

            {groups.length === 0 ? (
                <p className={styles.noGroupsMessage}>
                    You are not part of any groups yet. Why not create one?
                </p>
            ) : (
                <div className={styles.groupList}>
                    {groups.map((group) => (
                        <GroupItem key={group.id} group={group}
                            onEditGroup={handleEditGroupClick}
                            onDeleteGroup={handleDeleteGroupClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;