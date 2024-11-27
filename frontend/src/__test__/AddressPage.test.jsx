import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AddressPage from '../components/pages/AddressPage';
import ApiService from '../service/ApiService';

// Mockear el servicio ApiService
vi.mock('../service/ApiService', () => {
    return {
        default: {
            getLoggedInUserInfo: vi.fn(),
            saveAndUpdateAddress: vi.fn(),
        },
    };
});

describe('AddressPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizar el formulario de añadir dirección', () => {
        render(
            <MemoryRouter initialEntries={['/add-address']}>
                <AddressPage />
            </MemoryRouter>
        );

        // Usar roles en lugar de getByText para evitar conflictos
        expect(screen.getByRole('heading', { name: /Añadir direccion/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Añadir direccion/i })).toBeInTheDocument();
    });

    it('debería renderizar el formulario de editar dirección si está en la ruta "/edit-address"', async () => {
        ApiService.getLoggedInUserInfo.mockResolvedValueOnce({
            user: {
                address: {
                    street: '123 Calle Falsa',
                    city: 'Springfield',
                    state: 'IL',
                    zipCode: '62704',
                    country: 'USA',
                },
            },
        });

        render(
            <MemoryRouter initialEntries={['/edit-address']}>
                <AddressPage />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: /Editar Direccion/i })).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByDisplayValue('123 Calle Falsa')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Springfield')).toBeInTheDocument();
            expect(screen.getByDisplayValue('IL')).toBeInTheDocument();
            expect(screen.getByDisplayValue('62704')).toBeInTheDocument();
            expect(screen.getByDisplayValue('USA')).toBeInTheDocument();
        });
    });

    it('debería mostrar un mensaje de error si no se puede cargar la información del usuario', async () => {
        ApiService.getLoggedInUserInfo.mockRejectedValueOnce({
            response: { data: { message: 'Error al cargar usuario' } },
        });

        render(
            <MemoryRouter initialEntries={['/edit-address']}>
                <AddressPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Error al cargar usuario')).toBeInTheDocument();
        });
    });

    it('debería permitir actualizar los campos del formulario y enviar los datos', async () => {
        ApiService.saveAndUpdateAddress.mockResolvedValueOnce();

        render(
            <MemoryRouter initialEntries={['/add-address']}>
                <AddressPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Calle/i), { target: { name: 'street', value: 'Calle 1' } });
        fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { name: 'city', value: 'Ciudad X' } });
        fireEvent.change(screen.getByLabelText(/Provincia/i), { target: { name: 'state', value: 'Estado Y' } });
        fireEvent.change(screen.getByLabelText(/Codigo Postal/i), { target: { name: 'zipCode', value: '12345' } });
        fireEvent.change(screen.getByLabelText(/Pais/i), { target: { name: 'country', value: 'Pais Z' } });

        expect(screen.getByDisplayValue('Calle 1')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Ciudad X')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Estado Y')).toBeInTheDocument();
        expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Pais Z')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Añadir direccion/i }));

        await waitFor(() => {
            expect(ApiService.saveAndUpdateAddress).toHaveBeenCalledWith({
                street: 'Calle 1',
                city: 'Ciudad X',
                state: 'Estado Y',
                zipCode: '12345',
                country: 'Pais Z',
            });
        });
    });

    
});
