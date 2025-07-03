import { create } from 'zustand';
import type { Group } from '../types/Group';
import type { Expense } from '../types/Expense';
import { fetchUserGroups, createNewGroup, fetchGroupDetails, fetchGroupExpenses, fetchSettlementPlan, updateGroupName, deleteGroup, type UpdateGroupNamePayload, type CreateGroupPayload, addMemberToGroup, removeMemberFromGroup } from '../services/groupService';
import { createExpenseInGroup, updateExpense, deleteExpense } from '../services/expenseService';
import type { CreateExpensePayload, UpdateExpensePayload } from '../services/expenseService';
import { AxiosError } from 'axios';
import type { SettlementTransaction } from '../types/Settlement';


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

    settlementPlan: SettlementTransaction[];
    isLoadingSettlement: boolean;
    settlementError: string | null;
    getSettlementPlan: (groupId: string | number) => Promise<void>;
    clearSettlementPlan: () => void;

    isUpdatingExpense: boolean;
    updateExpenseError: string | null;
    isDeletingExpense: boolean;
    deleteExpenseError: string | null;

    editExpenseInGroup: (
        groupId: string | number,
        expenseId: string | number,
        payload: UpdateExpensePayload
    ) => Promise<Expense | null>;
    removeExpenseFromGroup: (
        groupId: string | number,
        expenseId: string | number
    ) => Promise<boolean>;

    isUpdatingGroup: boolean;
    updateGroupError: string | null;
    isDeletingGroup: boolean;
    deleteGroupError: string | null;

    editGroupDetails: (groupId: string | number, payload: UpdateGroupNamePayload) => Promise<Group | null>;
    removeGroup: (groupId: string | number) => Promise<boolean>;

    isManagingMembers: boolean;
    manageMembersError: string | null;

    addMember: (groupId: string | number, username: string) => Promise<boolean>;
    removeMember: (groupId: string | number, username: string) => Promise<boolean>;
}

export const useGroupStore = create<GroupState>()((set, get) => ({
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

    settlementPlan: [],
    isLoadingSettlement: false,
    settlementError: null,

    isUpdatingExpense: false,
    updateExpenseError: null,
    isDeletingExpense: false,
    deleteExpenseError: null,

    isUpdatingGroup: false,
    updateGroupError: null,
    isDeletingGroup: false,
    deleteGroupError: null,

    isManagingMembers: false,
    manageMembersError: null,

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

            settlementPlan: [],
            isLoadingSettlement: false,
            settlementError: null,
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

    getSettlementPlan: async (groupId) => {
        set({ isLoadingSettlement: true, settlementError: null, settlementPlan: [] });
        try {
            const plan = await fetchSettlementPlan(groupId);
            set({ settlementPlan: plan, isLoadingSettlement: false });
        } catch (e: unknown) {
            let errorMessage = 'Failed to fetch settlement plan';
            if (e instanceof AxiosError) {
                const errorData = e.response?.data as ApiErrorData | string | undefined;
                if (typeof errorData === 'string') { errorMessage = errorData; }
                else if (errorData?.detail) { errorMessage = errorData.detail; }
                else if (e.message) { errorMessage = e.message; }
            } else if (e instanceof Error) { errorMessage = e.message; }
            set({ settlementError: errorMessage, isLoadingSettlement: false });
        }
    },

    clearSettlementPlan: () => {
        set({ settlementPlan: [], isLoadingSettlement: false, settlementError: null });
    },

    editExpenseInGroup: async (groupId, expenseId, payload) => {
        set({ isUpdatingExpense: true, updateExpenseError: null });
        try {
            const updatedExpense = await updateExpense(groupId, expenseId, payload);
            set((state) => ({
                selectedGroupExpenses: state.selectedGroupExpenses.map((exp) =>
                    exp.id === expenseId ? updatedExpense : exp
                ),
                isUpdatingExpense: false,
            }));
            get().clearSettlementPlan();
            return updatedExpense;
        } catch (e: unknown) {
            let errorMessage = 'Failed to update expense';
            if (e instanceof AxiosError) {
                const errorData = e.response?.data as ApiErrorData | string | undefined;
                if (typeof errorData === 'string') { errorMessage = errorData; }
                else if (errorData?.detail) { errorMessage = errorData.detail; }
                else if (e.message) { errorMessage = e.message; }
            } else if (e instanceof Error) { errorMessage = e.message; }
            set({ updateExpenseError: errorMessage, isUpdatingExpense: false });
            return null;
        }
    },

    removeExpenseFromGroup: async (groupId, expenseId) => {
        set({ isDeletingExpense: true, deleteExpenseError: null });
        try {
            await deleteExpense(groupId, expenseId);
            set((state) => ({
                selectedGroupExpenses: state.selectedGroupExpenses.filter(
                    (exp) => exp.id !== expenseId
                ),
                isDeletingExpense: false,
            }));
            get().clearSettlementPlan();
            return true;
        } catch (e: unknown) {
            let errorMessage = "Failed to delete expense";
            if (e instanceof AxiosError) {
                const errorData = e.response?.data as ApiErrorData | string | undefined;
                if (typeof errorData === 'string') { errorMessage = errorData; }
                else if (errorData?.detail) { errorMessage = errorData.detail; }
                else if (e.message) { errorMessage = e.message; }
            } else if (e instanceof Error) { errorMessage = e.message; }
            set({ deleteExpenseError: errorMessage, isDeletingExpense: false });
            return false;
        }
    },

    editGroupDetails: async (groupId, payload) => {
        set({ isUpdatingGroup: true, updateGroupError: null });
        try {
            const updatedGroup = await updateGroupName(groupId, payload);
            set((state) => ({
                groups: state.groups.map((g) => (g.id === groupId ? updatedGroup : g)),
                selectedGroup: state.selectedGroup?.id === groupId ? updatedGroup : state.selectedGroup,
                isUpdatingGroup: false,
            }));
            return updatedGroup;
        } catch (e: unknown) {
            let errorMessage = 'Failed to update group';
            if (e instanceof AxiosError) {
                const errorData = e.response?.data as ApiErrorData | string | undefined;
                if (typeof errorData === 'string') { errorMessage = errorData; }
                else if (errorData?.detail) { errorMessage = errorData.detail; }
                else if (e.message) { errorMessage = e.message; }
            } else if (e instanceof Error) { errorMessage = e.message; }
            set({ updateGroupError: errorMessage, isUpdatingGroup: false });
            return null;
        }
    },

    removeGroup: async (groupId) => {
        set({ isDeletingGroup: true, deleteGroupError: null });
        try {
            await deleteGroup(groupId);
            set((state) => ({
                groups: state.groups.filter((g) => g.id !== groupId),
                selectedGroup: state.selectedGroup?.id === groupId ? null : state.selectedGroup,
                selectedGroupExpenses: state.selectedGroup?.id === groupId ? [] : state.selectedGroupExpenses,
                settlementPlan: state.selectedGroup?.id === groupId ? [] : state.settlementPlan,
                isLoadingSelectedGroup: state.selectedGroup?.id === groupId ? false : state.isLoadingSelectedGroup,
                selectedGroupError: state.selectedGroup?.id === groupId ? null : state.selectedGroupError,
                isDeletingGroup: false,
            }));
            return true;
        } catch (e: unknown) {
            let errorMessage = 'Failed to delete group';
            if (e instanceof AxiosError) {
                const errorData = e.response?.data as ApiErrorData | string | undefined;
                if (typeof errorData === 'string') { errorMessage = errorData; }
                else if (errorData?.detail) { errorMessage = errorData.detail; }
                else if (e.message) { errorMessage = e.message; }
            } else if (e instanceof Error) { errorMessage = e.message; }
            set({ deleteGroupError: errorMessage, isDeletingGroup: false });
            return false;
        }
    },

    addMember: async (groupId, username) => {
        set({ isManagingMembers: true, manageMembersError: null });
        try {
            const response = await addMemberToGroup(groupId, username);
            const newMember = response.member;

            set((state) => {
                if (!state.selectedGroup) {
                    return {};
                }
                return {
                    selectedGroup: {
                        ...state.selectedGroup,
                        members: [...state.selectedGroup.members, newMember],
                    },
                    isManagingMembers: false,
                };
            });
            return true;
        } catch (e: unknown) {
            let errorMessage = 'Failed to add member';
            if (e instanceof AxiosError && e.response?.data) {
                const errorData = e.response.data as ApiErrorData | string;

                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (typeof errorData === 'object' && errorData !== null) {
                    const firstErrorKey = Object.keys(errorData)[0];
                    if (firstErrorKey) {
                        const errorValue = errorData[firstErrorKey];
                        if (Array.isArray(errorValue)) {
                            errorMessage = errorValue[0];
                        } else {
                            errorMessage = String(errorValue);
                        }
                    } else {
                        errorMessage = e.message;
                    }
                } else {
                    errorMessage = e.message;
                }
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }
            set({ manageMembersError: errorMessage, isManagingMembers: false });
            return false;
        }
    },

    removeMember: async (groupId, username) => {
        set({ isManagingMembers: true, manageMembersError: null });
        try {
            await removeMemberFromGroup(groupId, username);
            set((state) => {
                if (!state.selectedGroup) {
                    return {};
                }
                return {
                    selectedGroup: {
                        ...state.selectedGroup,
                        members: state.selectedGroup.members.filter(
                            (member) => member.username !== username
                        ),
                    },
                    isManagingMembers: false,
                };
            });
            return true;
        } catch (e: unknown) {
            let errorMessage = 'Failed to remove member';
            if (e instanceof AxiosError) {
                const errorData = e.response?.data as ApiErrorData | string | undefined;
                if (typeof errorData === 'string') { errorMessage = errorData; }
                else if (errorData?.detail) { errorMessage = errorData.detail; }
                else if (e.message) { errorMessage = e.message; }
            } else if (e instanceof Error) { errorMessage = e.message; }
            set({ manageMembersError: errorMessage, isManagingMembers: false });
            return false;
        }
    },
}));