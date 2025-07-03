import apiClient from './apiClient';
import type { Group } from '../types/Group';
import type { Expense } from '../types/Expense';
import type { User } from '../types/User';
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

export interface UpdateGroupNamePayload {
    name: string;
}

export const updateGroupName = async (
    groupId: string | number,
    payload: UpdateGroupNamePayload
): Promise<Group> => {
    const { data } = await apiClient.patch<Group>
        (`/groups/${groupId}/`, payload);
    return data;
};

export const deleteGroup = async (groupId: string | number): Promise<void> => {
    await apiClient.delete(`/groups/${groupId}/`);
};

export interface AddMemberResponse {
    detail: string;
    member: User;
}

export const addMemberToGroup = async (
    groupId: string | number,
    username: string
): Promise<AddMemberResponse> => {
    const { data } = await apiClient.post<AddMemberResponse>(
        `/groups/${groupId}/members/`,
        { username }
    );
    return data;
};

export const removeMemberFromGroup = async (
    groupId: string | number,
    username: string
): Promise<void> => {
    await apiClient.delete(`/groups/${groupId}/members/`, { data: { username } });
};



