import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CartPage from '../components/pages/CartPage';
import ApiService from '../service/ApiService';
import { useCart } from '../components/context/CartContext';

// Mockear el servicio ApiService
vi.mock('../service/ApiService', () => {
    return {
        default: {
            isAuthenticated: vi.fn(),
            createOrder: vi.fn(),
        },
    };
});

// Mock para el contexto del carrito
const mockCart = [
    {
        id: 1,
        name: 'Producto 1',
        description: 'Descripción del producto 1',
        price: 10,
        quantity: 1,
        image: 'imagenBase64',
        imageType: 'image/jpeg',
    },
    {
        id: 2,
        name: 'Producto 2',
        description: 'Descripción del producto 2',
        price: 20,
        quantity: 2,
        image: 'imagenBase64',
        imageType: 'image/jpeg',
    },
];

const mockDispatch = vi.fn();

vi.mock('../components/context/CartContext', () => ({
    useCart: () => ({
        cart: mockCart,
        dispatch: mockDispatch,
    }),
}));

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizar correctamente la página del carrito', () => {
        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: /Cart/i })).toBeInTheDocument();
        expect(screen.getByText('Producto 1')).toBeInTheDocument();
        expect(screen.getByText('Producto 2')).toBeInTheDocument();
    });

    it('debería incrementar la cantidad de un producto', () => {
        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getAllByText('+')[0]);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'INCREMENT_ITEM', payload: mockCart[0] });
    });

    it('debería decrementar la cantidad de un producto', () => {
        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getAllByText('-')[0]);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'REMOVE_ITEM', payload: mockCart[0] });
    });

    it('debería eliminar el producto si la cantidad es 1 y se decrementa', () => {
        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getAllByText('-')[0]);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'REMOVE_ITEM', payload: mockCart[0] });
    });

    it('debería mostrar un mensaje y redirigir al login si el usuario no está autenticado', async () => {
        ApiService.isAuthenticated.mockReturnValue(false);

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /Checkout/i }));

        await waitFor(() => {
            expect(screen.getByText('You need to log in before placing the order.')).toBeInTheDocument();
        });
    });

    it('debería manejar el proceso de checkout correctamente si el usuario está autenticado', async () => {
        ApiService.isAuthenticated.mockReturnValue(true);
        ApiService.createOrder.mockResolvedValueOnce({ status: 200, message: 'Pedido realizado con éxito' });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /Checkout/i }));

        await waitFor(() => {
            expect(screen.getByText('Pedido realizado con éxito')).toBeInTheDocument();
        });

        expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLEAR_CART' });
    });

    it('debería mostrar un mensaje de error si falla el proceso de checkout', async () => {
        ApiService.isAuthenticated.mockReturnValue(true);
        ApiService.createOrder.mockRejectedValueOnce({ response: { data: { message: 'Error al realizar el pedido' } } });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /Checkout/i }));

        await waitFor(() => {
            expect(screen.getByText('Error al realizar el pedido')).toBeInTheDocument();
        });
    });
});
