import apiClient from './apiClient';
import type { Group } from '../types/Group';


export const fetchUserGroups = async (): Promise<Group[]> => {
    const { data } = await apiClient.get<Group[]>('/groups/');
    return data;
};

