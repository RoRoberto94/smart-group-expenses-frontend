import { create } from 'zustand';
import type { Group } from '../types/Group';
import { fetchUserGroups } from '../services/groupService';
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
}

export const useGroupStore = create<GroupState>()((set, _get) => ({
    groups: [],
    isLoading: false,
    error: null,

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
}));