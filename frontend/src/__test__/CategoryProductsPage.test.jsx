import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CategoryProductsPage from '../components/pages/CategoryProductsPage';
import ApiService from '../service/ApiService';

// Mockear el servicio ApiService
vi.mock('../service/ApiService', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        default: {
            getAllProductByCategoryId: vi.fn(),
        },
    };
});

vi.mock('../components/context/CartContext', () => ({
    useCart: () => ({
        cart: [],
        dispatch: vi.fn(),
    }),
}));

describe('CategoryProductsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizar correctamente la lista de productos por categoría', async () => {
        ApiService.getAllProductByCategoryId.mockResolvedValue({
            productList: [
                { id: 1, name: 'Producto 1', price: 100 },
                { id: 2, name: 'Producto 2', price: 200 },
            ],
        });

        render(
            <MemoryRouter initialEntries={['/category/1']}>
                <Routes>
                    <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Producto 1')).toBeInTheDocument();
            expect(screen.getByText('Producto 2')).toBeInTheDocument();
        });
    });

    it('debería mostrar un mensaje de error si falla la carga de los productos', async () => {
        ApiService.getAllProductByCategoryId.mockRejectedValue({
            response: { data: { message: 'No se puede obtener los productos de esa categoria' } },
        });

        render(
            <MemoryRouter initialEntries={['/category/1']}>
                <Routes>
                    <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No se puede obtener los productos de esa categoria')).toBeInTheDocument();
        });
    });

    it('debería cambiar de página al hacer clic en el botón de paginación', async () => {
        ApiService.getAllProductByCategoryId.mockResolvedValue({
            productList: Array.from({ length: 10 }, (_, index) => ({ id: index + 1, name: `Producto ${index + 1}`, price: (index + 1) * 100 })),
        });

        render(
            <MemoryRouter initialEntries={['/category/1']}>
                <Routes>
                    <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
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
