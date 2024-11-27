import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import AdminPage from "../components/admin/AdminPage";

// Mock del useNavigate
vi.mock("react-router-dom", async () => {
  const original = await vi.importActual("react-router-dom");
  return {
    ...original,
    useNavigate: vi.fn(),
  };
});

describe("AdminPage Component", () => {
  it("debería renderizar correctamente el componente", () => {
    const { getByText } = render(
      <Router>
        <AdminPage />
      </Router>
    );

    expect(getByText("Bienvenido Admin")).toBeInTheDocument();
    expect(getByText("Gestionar Categorias")).toBeInTheDocument();
    expect(getByText("Gestionar Productos")).toBeInTheDocument();
    expect(getByText("Gestionar Pedidos")).toBeInTheDocument();
  });

  it("debería navegar a la página de categorías al hacer clic en 'Gestionar Categorias'", () => {
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    const { getByText } = render(
      <Router>
        <AdminPage />
      </Router>
    );

    const categoriasButton = getByText("Gestionar Categorias");
    fireEvent.click(categoriasButton);

    expect(navigate).toHaveBeenCalledWith("/admin/categories");
  });

  it("debería navegar a la página de productos al hacer clic en 'Gestionar Productos'", () => {
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    const { getByText } = render(
      <Router>
        <AdminPage />
      </Router>
    );

    const productosButton = getByText("Gestionar Productos");
    fireEvent.click(productosButton);

    expect(navigate).toHaveBeenCalledWith("/admin/products");
  });

  it("debería navegar a la página de pedidos al hacer clic en 'Gestionar Pedidos'", () => {
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    const { getByText } = render(
      <Router>
        <AdminPage />
      </Router>
    );

    const pedidosButton = getByText("Gestionar Pedidos");
    fireEvent.click(pedidosButton);

    expect(navigate).toHaveBeenCalledWith("/admin/orders");
  });
});
