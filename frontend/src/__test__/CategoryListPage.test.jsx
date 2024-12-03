import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CategoryListPage from '../components/pages/CategoryListPage';
import ApiService from '../service/ApiService';

// Mockear el servicio ApiService
vi.mock('../service/ApiService', () => {
    return {
        default: {
            getAllCategory: vi.fn(),
        },
    };
});

// Definir navigateMock para el uso en las pruebas
const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

describe('CategoryListPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizar correctamente la lista de categorías', async () => {
        ApiService.getAllCategory.mockResolvedValueOnce({
            categoryList: [
                { id: 1, name: 'Categoría 1' },
                { id: 2, name: 'Categoría 2' },
            ],
        });

        render(
            <MemoryRouter>
                <CategoryListPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Categories/i })).toBeInTheDocument();
            expect(screen.getByText('Categoría 1')).toBeInTheDocument();
            expect(screen.getByText('Categoría 2')).toBeInTheDocument();
        });
    });

    it('debería mostrar un mensaje de error si falla la carga de las categorías', async () => {
        ApiService.getAllCategory.mockRejectedValueOnce({
            response: { data: { message: 'No se puede obtener las categorias' } },
        });

        render(
            <MemoryRouter>
                <CategoryListPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No se puede obtener las categorias')).toBeInTheDocument();
        });
    });

    it('debería navegar a la página de la categoría al hacer clic en una categoría', async () => {
        ApiService.getAllCategory.mockResolvedValueOnce({
            categoryList: [
                { id: 1, name: 'Categoría 1' },
            ],
        });

        render(
            <MemoryRouter>
                <CategoryListPage />
            </MemoryRouter>
        );

        // Esperar a que se renderice la categoría
        await waitFor(() => {
            expect(screen.getByText('Categoría 1')).toBeInTheDocument();
        });

        // Hacer clic en la categoría
        fireEvent.click(screen.getByText('Categoría 1'));
        
        // Verificar la navegación
        expect(navigateMock).toHaveBeenCalledWith('/category/1');
    });
});
