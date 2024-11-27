// ProtectedRoute.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProtectedRoute, AdminRoute } from '../service/Guard';
import ApiService from '../service/ApiService';

// Mock del ApiService
vi.mock('../service/ApiService', () => {
  return {
    __esModule: true,
    default: {
      isAuthenticated: vi.fn(),
      isAdmin: vi.fn(),
    },
  };
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el componente si el usuario está autenticado', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    
    const TestComponent = () => <div>Componente Protegido</div>;

    const { getByText } = render(
      <MemoryRouter initialEntries={['/protegido']}>
        <Routes>
          <Route
            path="/protegido"
            element={<ProtectedRoute element={<TestComponent />} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Componente Protegido')).toBeInTheDocument();
  });

  it('debería redirigir al login si el usuario no está autenticado', () => {
    ApiService.isAuthenticated.mockReturnValue(false);

    const TestComponent = () => <div>Componente Protegido</div>;

    const { getByText } = render(
      <MemoryRouter initialEntries={['/protegido']}>
        <Routes>
          <Route
            path="/protegido"
            element={<ProtectedRoute element={<TestComponent />} />}
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Página de Login')).toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el componente si el usuario es administrador', () => {
    ApiService.isAdmin.mockReturnValue(true);

    const AdminComponent = () => <div>Componente Admin</div>;

    const { getByText } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={<AdminRoute element={<AdminComponent />} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Componente Admin')).toBeInTheDocument();
  });

  it('debería redirigir al login si el usuario no es administrador', () => {
    ApiService.isAdmin.mockReturnValue(false);

    const AdminComponent = () => <div>Componente Admin</div>;

    const { getByText } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={<AdminRoute element={<AdminComponent />} />}
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Página de Login')).toBeInTheDocument();
  });
});
