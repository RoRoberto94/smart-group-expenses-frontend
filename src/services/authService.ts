import apiClient from './apiClient';
import type { User, AuthTokens } from '../types/User';


export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name?: string;
    last_name?: string;
}
export const registerUserService = async (payload: RegisterPayload):
    Promise<User> => {
    const { data: responseData } = await apiClient.post<User>('/auth/register/', payload);
    return responseData;
};

export const loginUser = async (data: LoginData):
    Promise<AuthTokens> => {
    const { data: responseData } = await apiClient.post<AuthTokens>('/auth/login/', data);
    return responseData;
};

export const getUserDetails = async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/user');
    return data;
};

export const refreshToken = async (refreshTok: string):
    Promise<AuthTokens> => {
    const { data } = await apiClient.post<AuthTokens>('/auth/refresh/', { refresh: refreshTok });
    return data;
};

export interface UpdateProfilePayload {
    first_name?: string;
    last_name?: string;
}

export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<User> => {
    const { data } = await apiClient.patch<User>('/auth/user/', payload);
    return data;
}

