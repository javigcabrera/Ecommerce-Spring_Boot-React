import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import EditCategory from "../components/admin/EditCategory";
import ApiService from "../service/ApiService";

// Mock del ApiService
vi.mock("../service/ApiService", () => ({
  default: {
    getCategoryById: vi.fn(),
    updateCategory: vi.fn(),
  },
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("EditCategory Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería mostrar un mensaje de error si la API devuelve un error al cargar la categoría", async () => {
    ApiService.getCategoryById.mockRejectedValueOnce({
      response: { data: { message: "Error al cargar la categoría" } },
    });

    const { findByText } = render(
      <Router>
        <EditCategory />
      </Router>
    );

    const errorMessage = await waitFor(() =>
      findByText("Error al cargar la categoría")
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("debería mostrar un mensaje de error si la API devuelve un error al actualizar la categoría", async () => {
    ApiService.getCategoryById.mockResolvedValueOnce({
      category: { name: "Categoría Existente" },
    });
    ApiService.updateCategory.mockRejectedValueOnce({
      response: { data: { message: "Error al actualizar la categoría" } },
    });

    const { getByPlaceholderText, getByText, findByText } = render(
      <Router>
        <EditCategory />
      </Router>
    );

    const input = await waitFor(() => getByPlaceholderText("Category Name"));
    fireEvent.change(input, { target: { value: "Categoría Inválida" } });

    const submitButton = getByText("Update");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessage = await waitFor(() =>
      findByText("Error al actualizar la categoría")
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("debería manejar errores desconocidos correctamente", async () => {
    ApiService.getCategoryById.mockResolvedValueOnce({
      category: { name: "Categoría Existente" },
    });
    ApiService.updateCategory.mockRejectedValueOnce(new Error("Error desconocido"));

    const { getByPlaceholderText, getByText, findByText } = render(
      <Router>
        <EditCategory />
      </Router>
    );

    const input = await waitFor(() => getByPlaceholderText("Category Name"));
    fireEvent.change(input, { target: { value: "Categoría Inválida" } });

    const submitButton = getByText("Update");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessage = await waitFor(() => findByText("Error desconocido"));
    expect(errorMessage).toBeInTheDocument();
  });
});
