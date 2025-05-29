import { create } from 'zustand';
import type { Group } from '../types/Group';
import { fetchUserGroups, createNewGroup } from '../services/groupService';
import type { CreateGroupPayload } from '../services/groupService';
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
}

export const useGroupStore = create<GroupState>()((set, _get) => ({
    groups: [],
    isLoading: false,
    error: null,
    isCreating: false,
    createError: null,

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
}));