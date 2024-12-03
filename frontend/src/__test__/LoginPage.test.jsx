import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LoginPage from '../components/pages/LoginPage';
import ApiService from '../service/ApiService';

// Mockear el servicio ApiService
vi.mock('../service/ApiService', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        default: {
            loginUser: vi.fn(),
        },
    };
});

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizar el formulario de inicio de sesión correctamente', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Cambiar la consulta a 'Email' y 'Password' en inglés
        expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Access/i })).toBeInTheDocument();
    });

    it('debería mostrar un mensaje de éxito y redirigir al perfil al iniciar sesión correctamente', async () => {
        ApiService.loginUser.mockResolvedValueOnce({
            status: 200,
            token: 'fakeToken',
            role: 'user',
        });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Access/i }));

        await waitFor(() => {
            expect(screen.getByText('You have logged in successfully.')).toBeInTheDocument();
        });
    });

    it('debería mostrar un mensaje de error si falla el inicio de sesión', async () => {
        ApiService.loginUser.mockRejectedValueOnce({
            response: { data: { message: 'Invalid credentials' } },
        });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /Access/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});
