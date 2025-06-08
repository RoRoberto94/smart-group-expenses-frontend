import { create } from 'zustand';
import type { Group } from '../types/Group';
import type { Expense } from '../types/Expense';
import { fetchUserGroups, createNewGroup, fetchGroupDetails, fetchGroupExpenses, type CreateGroupPayload } from '../services/groupService';
import { createExpenseInGroup } from '../services/expenseService';
import type { CreateExpensePayload } from '../services/expenseService';
import { AxiosError } from 'axios';


interface ApiErrorData {
    detail?: string;
    [key: string]: string | string[] | undefined;
}

interface GroupState {
    groups: Group[];
    isLoading: boolean;
    error: string | null;
    fetchGroups: () => Promise<void>

    isCreating: boolean;
    createError: string | null;
    createGroup: (payload: CreateGroupPayload) => Promise<Group | null>;

    selectedGroup: Group | null;
    selectedGroupExpenses: Expense[];
    isLoadingSelectedGroup: boolean;
    selectedGroupError: string | null;

    fetchSelectedGroupData: (groupId: string | number) => Promise<void>;
    clearSelectedGroupData: () => void;

    isCreatingExpense: boolean;
    createExpenseError: string | null;
    addExpenseToGroup: (groupId: string | number, payload: CreateExpensePayload) => Promise<Expense | null>;
}

export const useGroupStore = create<GroupState>()((set, _get) => ({
    groups: [],
    isLoading: false,
    error: null,
    isCreating: false,
    createError: null,

    selectedGroup: null,
    selectedGroupExpenses: [],
    isLoadingSelectedGroup: false,
    selectedGroupError: null,

    isCreatingExpense: false,
    createExpenseError: null,

    fetchGroups: async () => {
        set({ isLoading: true, error: null });
        try {
            const userGroups = await fetchUserGroups();
            set({ groups: userGroups, isLoading: false });
        } catch (e: unknown) {
            let errorMessage = 'Failed to fetch groups';
            if (e instanceof AxiosError) {
                const errorData = e.response?.data as ApiErrorData | string | undefined;
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData?.detail) {
                    errorMessage = errorData.detail;
                } else if (e.message) {
                    errorMessage = e.message;
                }
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }
            set({ error: errorMessage, isLoading: false, groups: [] });
        }
    },

    createGroup: async (payload) => {
        set({ isCreating: true, createError: null });
        try {
            const newGroup = await createNewGroup(payload);
            set((state) => ({
                groups: [newGroup, ...state.groups],
                isCreating: false,
            }));
            return newGroup;
        } catch (e: unknown) {
            let errorMessage = 'Failed to create group';
            if (e instanceof AxiosError) {
                const errorData = e.response?.data as ApiErrorData | string | undefined;
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData) {
                    if (errorData.name && Array.isArray(errorData.name)) {
                        errorMessage = `Name: ${errorData.name.join(', ')}`;
                    } else if (typeof errorData.name === 'string') {
                        errorMessage = `Name: ${errorData.name}`;
                    } else if (errorData.detail) {
                        errorMessage = errorData.detail;
                    } else if (e.message) {
                        errorMessage = e.message;
                    }
                } else if (e.message) {
                    errorMessage = e.message;
                }
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }
            set({ createError: errorMessage, isCreating: false });
            return null;
        }
    },

    fetchSelectedGroupData: async (groupId) => {
        set({
            isLoadingSelectedGroup: true,
            selectedGroupError: null,
            selectedGroup: null,
            selectedGroupExpenses: []
        });
        try {
            const [groupDetails, groupExpenses] = await Promise.all([
                fetchGroupDetails(groupId),
                fetchGroupExpenses(groupId),
            ]);
            set({
                selectedGroup: groupDetails,
                selectedGroupExpenses: groupExpenses,
                isLoadingSelectedGroup: false,
            });
        } catch (e: unknown) {
            let errorMessage = 'Failed to fetch group data';
            if (e instanceof AxiosError) {
                const errorData = e.response?.data as ApiErrorData | string | undefined;
                if (typeof errorData === 'string') { errorMessage = errorData; }
                else if (errorData?.detail) { errorMessage = errorData.detail; }
                else if (e.message) { errorMessage = e.message; }
            } else if (e instanceof Error) { errorMessage = e.message; }
            set({ selectedGroupError: errorMessage, isLoadingSelectedGroup: false });
        }
    },

    clearSelectedGroupData: () => {
        set({
            selectedGroup: null,
            selectedGroupExpenses: [],
            isLoadingSelectedGroup: false,
            selectedGroupError: null,
        });
    },

    addExpenseToGroup: async (groupId, payload) => {
        set({ isCreatingExpense: true, createExpenseError: null });
        try {
            const newExpense = await createExpenseInGroup(groupId, payload);
            set((state) => ({
                selectedGroupExpenses: [newExpense, ...state.selectedGroupExpenses],
                isCreatingExpense: false,
            }));
            return newExpense;
        } catch (e: unknown) {
            let errorMessage = 'Failed to add expense';
            if (e instanceof AxiosError) {
                const errorData = e.response?.data as ApiErrorData | string | undefined;
                if (typeof errorData === 'string') { errorMessage = errorData; }
                else if (errorData) {
                    if (errorData.description && Array.isArray(errorData.description)) {
                        errorMessage = `Description: ${errorData.description.join(', ')}`;
                    } else if (errorData.amount && Array.isArray(errorData.amount)) {
                        errorMessage = `Amount: ${errorData.amount.join(', ')}`;
                    } else if (errorData.detail) { errorMessage = errorData.detail; }
                    else if (e.message) { errorMessage = e.message; }
                } else if (e.message) { errorMessage = e.message; }
            } else if (e instanceof Error) { errorMessage = e.message; }
            set({ createExpenseError: errorMessage, isCreatingExpense: false });
            return null;
        }
    },
}));