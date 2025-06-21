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
};

export interface UpdateExpensePayload {
    description?: string;
    amount?: string;
}

export const updateExpense = async (
    groupId: string | number,
    expenseId: string | number,
    payload: UpdateExpensePayload
): Promise<Expense> => {
    const { data } = await apiClient.patch<Expense>(
        `/groups/${groupId}/expenses/${expenseId}/`,
        payload
    );
    return data;
};

export const deleteExpense = async (
    groupId: string | number,
    expenseId: string | number
): Promise<void> => {
    await apiClient.delete(`/groups/${groupId}/expenses/${expenseId}/`);
};
