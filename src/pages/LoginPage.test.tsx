import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';


vi.mock('../services/authService', () => ({
    loginUser: vi.fn(),
}));

beforeEach(() => {
    useAuthStore.getState().logout();
});

const renderWithRouter = () => {
    return render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<div> Dashboard Page Mock</div>} />
            </Routes>
        </MemoryRouter>
    );
};

describe('LoginPage Component', () => {
    it('should render the login form correctly', () => {
        renderWithRouter();
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();

        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should show an error message on failed login', async () => {
        const user = userEvent.setup();
        const { loginUser } = await import('../services/authService');

        (loginUser as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
            new Error('Invalid credentials')
        );

        renderWithRouter();

        await user.type(screen.getByLabelText(/username/i), 'wronguser');
        await user.type(screen.getByLabelText(/password/i), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /login/i }));

        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it('should redirect to dashboard successful login', async () => {
        const user = userEvent.setup();
        const { loginUser } = await import('../services/authService');

        (loginUser as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            access: 'fake-access-token',
            refresh: 'fake-refresh-token',
        });

        useAuthStore.getState().loadUserFromToken = vi.fn().mockImplementation(() => {
            useAuthStore.setState({ user: { id: 1, username: 'testuser', email: 'test@test.com' }, isAuthenticated: true });
        });

        renderWithRouter();

        await user.type(screen.getByLabelText(/username/i), 'testuser');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/dashboard page mock/i)).toBeInTheDocument();
        });
    });
});