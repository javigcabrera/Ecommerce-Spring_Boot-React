import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import AddCategory from "../components/admin/AddCategory";
import ApiService from "../service/ApiService";

// Mock del ApiService
vi.mock("../service/ApiService", () => ({
  default: {
    createCategory: vi.fn(),
  },
}));

describe("AddCategory Component", () => {
  it("debería renderizar el formulario correctamente", () => {
    const { getByPlaceholderText, getByText } = render(
      <Router>
        <AddCategory />
      </Router>
    );

    // Se busca el placeholder correcto en inglés: "Category Name"
    expect(getByPlaceholderText("Category Name")).toBeInTheDocument();
    expect(getByText("Add")).toBeInTheDocument();
  });

  it("debería actualizar el estado cuando se escribe en el campo de entrada", () => {
    const { getByPlaceholderText } = render(
      <Router>
        <AddCategory />
      </Router>
    );

    const input = getByPlaceholderText("Category Name");
    fireEvent.change(input, { target: { value: "Nueva Categoría" } });

    expect(input.value).toBe("Nueva Categoría");
  });

  it("debería mostrar un mensaje de éxito cuando se añade una categoría correctamente", async () => {
    ApiService.createCategory.mockResolvedValueOnce({
      status: 200,
      message: "Categoría creada con éxito",
    });

    const { getByPlaceholderText, getByText, findByText } = render(
      <Router>
        <AddCategory />
      </Router>
    );

    const input = getByPlaceholderText("Category Name");
    fireEvent.change(input, { target: { value: "Nueva Categoría" } });

    const submitButton = getByText("Add");
    fireEvent.click(submitButton);

    const successMessage = await findByText("Categoría creada con éxito");
    expect(successMessage).toBeInTheDocument();
  });

  it("debería mostrar un mensaje de error si la API devuelve un error", async () => {
    ApiService.createCategory.mockRejectedValueOnce({
      response: { data: { message: "Error al crear la categoría" } },
    });

    const { getByPlaceholderText, getByText, findByText } = render(
      <Router>
        <AddCategory />
      </Router>
    );

    const input = getByPlaceholderText("Category Name");
    fireEvent.change(input, { target: { value: "Categoría inválida" } });

    const submitButton = getByText("Add");
    fireEvent.click(submitButton);

    const errorMessage = await findByText("Error al crear la categoría");
    expect(errorMessage).toBeInTheDocument();
  });

  it("debería manejar errores desconocidos correctamente", async () => {
    ApiService.createCategory.mockRejectedValueOnce(new Error("Error desconocido"));

    const { getByPlaceholderText, getByText, findByText } = render(
      <Router>
        <AddCategory />
      </Router>
    );

    const input = getByPlaceholderText("Category Name");
    fireEvent.change(input, { target: { value: "Categoría inválida" } });

    const submitButton = getByText("Add");
    fireEvent.click(submitButton);

    const errorMessage = await findByText("Error desconocido");
    expect(errorMessage).toBeInTheDocument();
  });
});
