import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProfilePage from '../components/pages/ProfilePage';
import ApiService from '../service/ApiService';
import { useNavigate } from 'react-router-dom';

// Mock del ApiService
vi.mock('../service/ApiService', () => {
    return {
        __esModule: true,
        default: {
            getLoggedInUserInfo: vi.fn(),
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

describe('ProfilePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizar la información del usuario correctamente', async () => {
        // Configurar el mock para los datos del usuario
        ApiService.getLoggedInUserInfo.mockResolvedValueOnce({
            user: {
                id: 1,
                name: 'Usuario de prueba',
                email: 'usuario@prueba.com',
                phoneNumber: '123456789',
                address: {
                    street: 'Calle de Prueba',
                    city: 'Ciudad de Prueba',
                    state: 'Estado de Prueba',
                    zipCode: '12345',
                    country: 'País de Prueba',
                },
                orderItemList: [
                    {
                        id: 1,
                        product: {
                            name: 'Producto de Prueba',
                            image: 'imagenBase64',
                            imageType: 'image/jpeg',
                        },
                        status: 'Enviado',
                        quantity: 2,
                        price: 50.0,
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        // Verificar que se muestra el mensaje de carga inicialmente
        expect(screen.getByTestId('loading-message')).toBeInTheDocument();

        // Esperar a que los datos del usuario se carguen y se muestren
        await waitFor(() => {
            expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome Usuario de prueba');
            expect(screen.getByTestId('user-name')).toHaveTextContent('Name: Usuario de prueba');
            expect(screen.getByTestId('user-email')).toHaveTextContent('Email: usuario@prueba.com');
            expect(screen.getByTestId('user-phone')).toHaveTextContent('Phone Number: 123456789');
        });

        // Verificar información de dirección
        expect(screen.getByTestId('user-street')).toHaveTextContent('Street: Calle de Prueba');
        expect(screen.getByTestId('user-city')).toHaveTextContent('City: Ciudad de Prueba');
        expect(screen.getByTestId('user-state')).toHaveTextContent('State: Estado de Prueba');
        expect(screen.getByTestId('user-zipcode')).toHaveTextContent('Zip Code: 12345');
        expect(screen.getByTestId('user-country')).toHaveTextContent('Country: País de Prueba');
    });

    it('debería navegar a la página de edición o añadir dirección al hacer clic en el botón de dirección', async () => {
        // Configurar el mock para los datos del usuario sin dirección
        ApiService.getLoggedInUserInfo.mockResolvedValueOnce({
            user: {
                id: 1,
                name: 'Usuario de prueba',
                email: 'usuario@prueba.com',
                phoneNumber: '123456789',
                address: null,
                orderItemList: [],
            },
        });

        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        // Esperar a que los datos del usuario se carguen
        await waitFor(() => {
            expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome Usuario de prueba');
        });

        // Hacer clic en el botón para añadir la dirección
        fireEvent.click(screen.getByTestId('address-button'));

        // Verificar que se haya llamado a la función de navegación con la ruta correcta
        expect(mockNavigate).toHaveBeenCalledWith('/add-address');
    });

    it('debería navegar a la página de edición de dirección si ya existe una dirección', async () => {
        // Configurar el mock para los datos del usuario con dirección
        ApiService.getLoggedInUserInfo.mockResolvedValueOnce({
            user: {
                id: 1,
                name: 'Usuario de prueba',
                email: 'usuario@prueba.com',
                phoneNumber: '123456789',
                address: {
                    street: 'Calle de Prueba',
                    city: 'Ciudad de Prueba',
                    state: 'Estado de Prueba',
                    zipCode: '12345',
                    country: 'País de Prueba',
                },
                orderItemList: [],
            },
        });

        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        // Esperar a que los datos del usuario se carguen
        await waitFor(() => {
            expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome Usuario de prueba');
        });

        // Hacer clic en el botón para editar la dirección
        fireEvent.click(screen.getByTestId('address-button'));

        // Verificar que se haya llamado a la función de navegación con la ruta correcta
        expect(mockNavigate).toHaveBeenCalledWith('/edit-address');
    });
});
