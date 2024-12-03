import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProductDetailsPage from '../components/pages/ProductDetailsPage';
import { useCart } from '../components/context/CartContext';
import ApiService from '../service/ApiService';

// Mock del ApiService
vi.mock('../service/ApiService', () => {
    return {
        __esModule: true,
        default: {
            getProductById: vi.fn(),
        },
    };
});

// Mock del contexto del carrito
vi.mock('../components/context/CartContext', () => ({
    useCart: vi.fn(),
}));

describe('ProductDetailsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizar correctamente los detalles del producto', async () => {
        // Configuración del mock de `getProductById`
        ApiService.getProductById.mockResolvedValueOnce({
            product: {
                id: 1,
                name: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                price: 100,
                image: 'imagenBase64',
            },
        });

        // Mock del contexto del carrito
        useCart.mockReturnValue({
            cart: [],
            dispatch: vi.fn(),
        });

        render(
            <MemoryRouter initialEntries={['/product/1']}>
                <Routes>
                    <Route path="/product/:productId" element={<ProductDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Verificar que se muestra el mensaje de carga mientras espera la respuesta
        expect(screen.getByText('Loading product details...')).toBeInTheDocument(); // Cambiado a inglés

        // Esperar hasta que el producto cargue y comprobar que se muestra en el DOM
        await waitFor(() => {
            expect(screen.getByText('Producto de prueba')).toBeInTheDocument();
            expect(screen.getByText('Descripción del producto de prueba')).toBeInTheDocument();
            expect(screen.getByText('100.00€')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument(); // Cambiado a inglés
        });
    });

    it('debería agregar el producto al carrito cuando se hace clic en "Add to Cart"', async () => {
        const mockDispatch = vi.fn();

        // Configuración del mock de `getProductById`
        ApiService.getProductById.mockResolvedValueOnce({
            product: {
                id: 1,
                name: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                price: 100,
                image: 'imagenBase64',
            },
        });

        // Mock del contexto del carrito
        useCart.mockReturnValue({
            cart: [],
            dispatch: mockDispatch,
        });

        render(
            <MemoryRouter initialEntries={['/product/1']}>
                <Routes>
                    <Route path="/product/:productId" element={<ProductDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Producto de prueba')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i })); // Cambiado a inglés

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'ADD_ITEM',
            payload: {
                id: 1,
                name: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                price: 100,
                image: 'imagenBase64',
            },
        });
    });

    it('debería incrementar la cantidad de un producto en el carrito', async () => {
        const mockDispatch = vi.fn();

        // Configuración del mock de `getProductById`
        ApiService.getProductById.mockResolvedValueOnce({
            product: {
                id: 1,
                name: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                price: 100,
                image: 'imagenBase64',
            },
        });

        // Mock del contexto del carrito con un producto ya existente
        useCart.mockReturnValue({
            cart: [{ id: 1, name: 'Producto de prueba', quantity: 1 }],
            dispatch: mockDispatch,
        });

        render(
            <MemoryRouter initialEntries={['/product/1']}>
                <Routes>
                    <Route path="/product/:productId" element={<ProductDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Producto de prueba')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /\+/i })); // Cambiado a "+"
        
        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'INCREMENT_ITEM',
            payload: {
                id: 1,
                name: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                price: 100,
                image: 'imagenBase64',
            },
        });
    });

    it('debería decrementar la cantidad o eliminar el producto si la cantidad es 1', async () => {
        const mockDispatch = vi.fn();

        // Configuración del mock de `getProductById`
        ApiService.getProductById.mockResolvedValueOnce({
            product: {
                id: 1,
                name: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                price: 100,
                image: 'imagenBase64',
            },
        });

        // Mock del contexto del carrito con un producto ya existente
        useCart.mockReturnValue({
            cart: [{ id: 1, name: 'Producto de prueba', quantity: 1 }],
            dispatch: mockDispatch,
        });

        render(
            <MemoryRouter initialEntries={['/product/1']}>
                <Routes>
                    <Route path="/product/:productId" element={<ProductDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Producto de prueba')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /-/i })); // Cambiado a "-"

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'REMOVE_ITEM',
            payload: {
                id: 1,
                name: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                price: 100,
                image: 'imagenBase64',
            },
        });
    });
});
