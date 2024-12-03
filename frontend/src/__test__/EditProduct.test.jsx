import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import EditProduct from "../components/admin/EditProduct";
import ApiService from "../service/ApiService";

// Mock del ApiService
vi.mock("../service/ApiService", () => ({
  default: {
    getAllCategory: vi.fn(),
    getProductById: vi.fn(),
    updateProduct: vi.fn(),
  },
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const original = await vi.importActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
    useParams: () => ({ productId: "1" }), // Mock de productId para pruebas
  };
});

describe("EditProduct Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar correctamente el formulario con datos precargados", async () => {
    ApiService.getAllCategory.mockResolvedValueOnce({
      categoryList: [
        { id: "1", name: "Categoría 1" },
        { id: "2", name: "Categoría 2" },
      ],
    });

    ApiService.getProductById.mockResolvedValueOnce({
      product: {
        name: "Producto Existente",
        description: "Descripción existente",
        price: 100,
        categoryId: "1",
        image: null,
      },
    });

    const { getByPlaceholderText, getByRole, getByDisplayValue } = render(
      <Router>
        <EditProduct />
      </Router>
    );

    // Espera a que se rendericen los datos de la categoría
    await waitFor(() => getByRole("combobox"));

    // Asegura que los valores precargados se muestren correctamente
    expect(getByPlaceholderText("Product Name").value).toBe("Producto Existente");
    expect(getByPlaceholderText("Description").value).toBe("Descripción existente");
    expect(getByPlaceholderText("Price").value).toBe("100");
    expect(getByDisplayValue("Categoría 1")).toBeInTheDocument();
  });

  it("debería actualizar el estado cuando los campos cambian", async () => {
    ApiService.getAllCategory.mockResolvedValueOnce({
      categoryList: [{ id: "1", name: "Categoría 1" }],
    });

    ApiService.getProductById.mockResolvedValueOnce({
      product: {
        name: "Producto Existente",
        description: "Descripción existente",
        price: 100,
        categoryId: "1",
        image: null,
      },
    });

    const { getByPlaceholderText } = render(
      <Router>
        <EditProduct />
      </Router>
    );

    const nameInput = await waitFor(() =>
      getByPlaceholderText("Product Name")
    );
    fireEvent.change(nameInput, { target: { value: "Nuevo Nombre" } });
    expect(nameInput.value).toBe("Nuevo Nombre");

    const descriptionInput = getByPlaceholderText("Description");
    fireEvent.change(descriptionInput, {
      target: { value: "Nueva descripción" },
    });
    expect(descriptionInput.value).toBe("Nueva descripción");

    const priceInput = getByPlaceholderText("Price");
    fireEvent.change(priceInput, { target: { value: "200" } });
    expect(priceInput.value).toBe("200");
  });

  it("debería mostrar un mensaje de error si falla la actualización", async () => {
    ApiService.getAllCategory.mockResolvedValueOnce({
      categoryList: [{ id: "1", name: "Categoría 1" }],
    });

    ApiService.getProductById.mockResolvedValueOnce({
      product: {
        name: "Producto Existente",
        description: "Descripción existente",
        price: 100,
        categoryId: "1",
        image: null,
      },
    });

    ApiService.updateProduct.mockRejectedValueOnce({
      response: { data: { message: "Error al actualizar el producto" } },
    });

    const { getByText, getByPlaceholderText, getByRole, findByText } = render(
      <Router>
        <EditProduct />
      </Router>
    );

    await waitFor(() => getByRole("combobox"));

    const nameInput = getByPlaceholderText("Product Name");
    fireEvent.change(nameInput, { target: { value: "Nuevo Producto" } });

    const submitButton = getByText("Update");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessage = await findByText("Error al actualizar el producto");
    expect(errorMessage).toBeInTheDocument();
  });
});
