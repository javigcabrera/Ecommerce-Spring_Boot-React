import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RegisterPage from '../components/pages/RegisterPage';
import ApiService from '../service/ApiService';

// Mock del ApiService
vi.mock('../service/ApiService', () => {
  return {
    __esModule: true,
    default: {
      registerUser: vi.fn(),
    },
  };
});

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el formulario de registro correctamente', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Verificar que los campos de entrada y el botón de registro se muestran
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument(); // Cambié el método para verificar el enlace
  });

  it('debería registrar al usuario correctamente y redirigir a la página de login', async () => {
    ApiService.registerUser.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Llenar los campos del formulario
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'usuario@prueba.com' } });
    fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: 'Usuario de prueba' } });
    fireEvent.change(screen.getByLabelText(/Phone Number:/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password123' } });

    // Hacer clic en el botón de registro
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Esperar a que se muestre el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText('User registered successfully.')).toBeInTheDocument();
    });

    // Simular la redirección después de 4 segundos
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 5000 });
  }, 10000); // Incrementar el tiempo de espera total de la prueba a 10 segundos

  it('debería mostrar un mensaje de error si ocurre un error al registrar', async () => {
    ApiService.registerUser.mockRejectedValueOnce(new Error('Error al registrar al usuario'));

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Llenar los campos del formulario
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'usuario@prueba.com' } });
    fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: 'Usuario de prueba' } });
    fireEvent.change(screen.getByLabelText(/Phone Number:/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password123' } });

    // Hacer clic en el botón de registro
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Esperar a que se muestre el mensaje de error
    await waitFor(() => {
      expect(screen.getByText('Error al registrar al usuario')).toBeInTheDocument();
    });
  }, 10000); // Incrementar el tiempo de espera total de la prueba a 10 segundos

  it('debería mostrar un mensaje personalizado si el email ya está registrado', async () => {
    ApiService.registerUser.mockRejectedValueOnce({
      response: {
        data: { message: 'Duplicate entry: The email already exists, please try another one.' }
      }
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Llenar los campos del formulario
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'usuario@prueba.com' } });
    fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: 'Usuario de prueba' } });
    fireEvent.change(screen.getByLabelText(/Phone Number:/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password123' } });

    // Hacer clic en el botón de registro
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Esperar a que se muestre el mensaje de error personalizado
    await waitFor(() => {
      expect(screen.getByText('The email already exists, please try another one.')).toBeInTheDocument();
    });
  }, 10000); // Incrementar el tiempo de espera total de la prueba a 10 segundos
});
