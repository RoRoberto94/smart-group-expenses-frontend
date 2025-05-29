import apiClient from './apiClient';
import type { Group } from '../types/Group';


export const fetchUserGroups = async (): Promise<Group[]> => {
    const { data } = await apiClient.get<Group[]>('/groups/');
    return data;
};

export interface CreateGroupPayload {
    name: string;
}

export const createNewGroup = async (payload: CreateGroupPayload): Promise<Group> => {
    const { data } = await apiClient.post<Group>('/groups/', payload);
    return data;
}