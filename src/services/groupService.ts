import apiClient from './apiClient';
import type { Group } from '../types/Group';
import type { Expense } from '../types/Expense';
import type { SettlementTransaction } from '../types/Settlement';


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

export const fetchGroupDetails = async (groupId: string | number): Promise<Group> => {
    const { data } = await apiClient.get<Group>(`/groups/${groupId}/`);
    return data;
};

export const fetchGroupExpenses = async (groupId: string | number): Promise<Expense[]> => {
    const { data } = await apiClient.get<Expense[]>(`/groups/${groupId}/expenses/`);
    return data;
};

export const fetchSettlementPlan = async (groupId: string | number): Promise<SettlementTransaction[]> => {
    const { data } = await apiClient.get<SettlementTransaction[]>(`/groups/${groupId}/settle/`);
    return data;
};


