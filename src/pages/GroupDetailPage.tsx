import { useParams } from 'react-router-dom';

const GroupDetailPage = () => {
    const { groupId } = useParams();
    return <div><h1>Group Detail Page</h1><p>Details for Group with ID: {groupId}</p></div>;
};

export default GroupDetailPage;