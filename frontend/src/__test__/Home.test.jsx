import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Home from '../components/pages/Home';
import ApiService from '../service/ApiService';

// Mockear el servicio ApiService
vi.mock('../service/ApiService', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        default: {
            getAllProducts: vi.fn(),
            searchProducts: vi.fn(),
        },
    };
});

vi.mock('../components/context/CartContext', () => ({
    useCart: () => ({
        cart: [],
        dispatch: vi.fn(),
    }),
}));

describe('Home', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizar correctamente la lista de productos', async () => {
        ApiService.getAllProducts.mockResolvedValue({
            productList: [
                { id: 1, name: 'Producto 1', price: 100 },
                { id: 2, name: 'Producto 2', price: 200 },
            ],
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Producto 1')).toBeInTheDocument();
            expect(screen.getByText('Producto 2')).toBeInTheDocument();
        });
    });

    it('debería mostrar un mensaje de error si falla la carga de los productos', async () => {
        ApiService.getAllProducts.mockRejectedValue({
            response: { data: { message: 'No se puede obtener los productos' } },
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No se puede obtener los productos')).toBeInTheDocument();
        });
    });

    it('debería realizar una búsqueda de productos y mostrar los resultados', async () => {
        ApiService.searchProducts.mockResolvedValue({
            productList: [
                { id: 3, name: 'Producto Buscado', price: 300 },
            ],
        });

        render(
            <MemoryRouter initialEntries={['/?search=buscado']}>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Producto Buscado')).toBeInTheDocument();
        });
    });

    it('debería cambiar de página al hacer clic en el botón de paginación', async () => {
        ApiService.getAllProducts.mockResolvedValue({
            productList: Array.from({ length: 10 }, (_, index) => ({ id: index + 1, name: `Producto ${index + 1}`, price: (index + 1) * 100 })),
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </MemoryRouter>
        );

        // Esperar a que se carguen los productos de la primera página
        await waitFor(() => {
            expect(screen.getByText('Producto 1')).toBeInTheDocument();
        });

        // Hacer clic en el botón para cambiar a la página 2
        fireEvent.click(screen.getByRole('button', { name: /2/i }));

        // Verificar que los productos de la página 2 se carguen
        await waitFor(() => {
            expect(screen.getByText('Producto 5')).toBeInTheDocument();
        });
    });
});