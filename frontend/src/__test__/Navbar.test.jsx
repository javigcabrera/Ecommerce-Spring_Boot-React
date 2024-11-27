import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import ApiService from "../service/ApiService";

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

describe("Navbar Component", () => {
  let mockNavigate;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("debería manejar el envío del formulario de búsqueda correctamente", () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    ApiService.isAdmin.mockReturnValue(false);

    render(
      <Router>
        <Navbar />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText("Busca productos");
    const searchButton = screen.getByText("Search");

    fireEvent.change(searchInput, { target: { value: "Laptop" } });
    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith("/?search=Laptop");
  });

  it("debería llamar a ApiService.logout y navegar a /login al cerrar sesión", () => {
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
      "Estas seguro de que quieres cerrar sesion?"
    );
    expect(ApiService.logout).toHaveBeenCalled();

    // Adelantar el temporizador para ejecutar el setTimeout
    vi.advanceTimersByTime(500);

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

    const logo = screen.getByAltText("Bazar Pepe");
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

    expect(screen.queryByText("Mi Perfil")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });
});
