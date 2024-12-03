import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import ApiService from "../service/ApiService";
import { useCart } from "../components/context/CartContext";

// Mock de ApiService
vi.mock("../service/ApiService", () => ({
  default: {
    isAuthenticated: vi.fn(),
    isAdmin: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock de react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock de useCart
vi.mock("../components/context/CartContext", () => ({
  useCart: vi.fn(), // Mock del hook
}));

describe("Navbar Component", () => {
  let mockNavigate;
  let mockDispatch;

  beforeEach(() => {
    // Limpiar mocks y redefinirlos
    vi.clearAllMocks();

    mockNavigate = vi.fn(); // Simular navegación
    mockDispatch = vi.fn(); // Simular dispatch

    useNavigate.mockReturnValue(mockNavigate);

    // Redefinir el comportamiento de useCart antes de cada prueba
    useCart.mockReturnValue({
      cart: [], // Simula un carrito vacío
      dispatch: mockDispatch, // Mock de dispatch
    });
  });

  it("debería manejar el envío del formulario de búsqueda correctamente", () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    ApiService.isAdmin.mockReturnValue(false);

    render(
      <Router>
        <Navbar />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText("Search products"); // Cambiado a inglés
    const searchButton = screen.getByText("Search");

    fireEvent.change(searchInput, { target: { value: "Laptop" } });
    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith("/?search=Laptop");
  });

  it("debería llamar a ApiService.logout, limpiar el carrito y navegar a /login al cerrar sesión", () => {
    vi.useFakeTimers(); // Usar temporizadores falsos para controlar el setTimeout

    ApiService.isAuthenticated.mockReturnValue(true);
    ApiService.isAdmin.mockReturnValue(false);

    render(
      <Router>
        <Navbar />
      </Router>
    );

    const logoutLink = screen.getByText("Logout");

    // Mockear confirm para simular confirmación positiva
    window.confirm = vi.fn(() => true);

    fireEvent.click(logoutLink);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to log out?" // Mensaje en inglés
    );
    expect(ApiService.logout).toHaveBeenCalled();

    // Adelantar el temporizador para ejecutar el setTimeout
    vi.advanceTimersByTime(500);

    // Verifica que se haya llamado a dispatch con la acción CLEAR_CART
    expect(mockDispatch).toHaveBeenCalledWith({ type: "CLEAR_CART" });

    // Verifica que navegue a /login después del timeout
    expect(mockNavigate).toHaveBeenCalledWith("/login");

    vi.useRealTimers(); // Restaurar temporizadores reales después de la prueba
  });

  it("debería limpiar la barra de búsqueda y navegar al Home al hacer clic en el logo", () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    ApiService.isAdmin.mockReturnValue(false);

    render(
      <Router>
        <Navbar />
      </Router>
    );

    const logo = screen.getByAltText("Ecommerce");
    fireEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("debería no mostrar enlaces de admin y perfil si el usuario no está autenticado", () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    ApiService.isAdmin.mockReturnValue(false);

    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.queryByText("My Profile")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });
});
