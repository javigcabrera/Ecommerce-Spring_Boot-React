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

        expect(screen.getByLabelText(/Correo Electrónico:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Acceder/i })).toBeInTheDocument();
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

        fireEvent.change(screen.getByLabelText(/Correo Electrónico:/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Contraseña:/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Acceder/i }));

        await waitFor(() => {
            expect(screen.getByText('Se ha iniciado sesión con éxito')).toBeInTheDocument();
        });
    });

    it('debería mostrar un mensaje de error si falla el inicio de sesión', async () => {
        ApiService.loginUser.mockRejectedValueOnce({
            response: { data: { message: 'Credenciales incorrectas' } },
        });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Correo Electrónico:/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Contraseña:/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /Acceder/i }));

        await waitFor(() => {
            expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
        });
    });
});
