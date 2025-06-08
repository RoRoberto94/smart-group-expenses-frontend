import apiClient from './apiClient';
import type { Expense } from '../types/Expense';


export interface CreateExpensePayload {
    description: string;
    amount: string;
}

export const createExpenseInGroup = async (
    groupId: string | number,
    payload: CreateExpensePayload
): Promise<Expense> => {
    const { data } = await apiClient.post<Expense>(
        `/groups/${groupId}/expenses/`,
        payload
    );
    return data;
}

