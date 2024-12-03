import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import AddProduct from "../components/admin/AddProduct";
import ApiService from "../service/ApiService";

// Mock del ApiService
vi.mock("../service/ApiService", () => ({
  default: {
    getAllCategory: vi.fn(),
    addProduct: vi.fn(),
  },
}));

describe("AddProduct Component", () => {
  beforeEach(() => {
    ApiService.getAllCategory.mockResolvedValueOnce({
      categoryList: [
        { id: "1", name: "Categoría 1" },
        { id: "2", name: "Categoría 2" },
      ],
    });
  });

  it("debería renderizar el formulario correctamente", async () => {
    const { getByPlaceholderText, getByText, getByRole } = render(
      <Router>
        <AddProduct />
      </Router>
    );

    await waitFor(() => getByRole("combobox"));

    // Verifica que los placeholders estén en inglés como "Product Name", "Product Description" y "Price"
    expect(getByPlaceholderText("Product Name")).toBeInTheDocument();
    expect(getByPlaceholderText("Product Description")).toBeInTheDocument();
    expect(getByPlaceholderText("Price")).toBeInTheDocument();
    expect(getByRole("combobox")).toBeInTheDocument();
    expect(getByText("Add")).toBeInTheDocument();
  });

  it("debería cargar las categorías correctamente", async () => {
    const { getByRole, getAllByRole } = render(
      <Router>
        <AddProduct />
      </Router>
    );

    await waitFor(() => getByRole("combobox"));

    const options = getAllByRole("option");
    expect(options).toHaveLength(3); // 1 opción de placeholder + 2 categorías mockeadas
    expect(options[1].textContent).toBe("Categoría 1");
    expect(options[2].textContent).toBe("Categoría 2");
  });

  it("debería actualizar los estados cuando se interactúa con los campos", async () => {
    const { getByPlaceholderText, getByRole } = render(
      <Router>
        <AddProduct />
      </Router>
    );

    await waitFor(() => getByRole("combobox"));

    const nameInput = getByPlaceholderText("Product Name");
    fireEvent.change(nameInput, { target: { value: "Nuevo Producto" } });
    expect(nameInput.value).toBe("Nuevo Producto");

    const descriptionInput = getByPlaceholderText("Product Description");
    fireEvent.change(descriptionInput, { target: { value: "Descripción detallada" } });
    expect(descriptionInput.value).toBe("Descripción detallada");

    const priceInput = getByPlaceholderText("Price");
    fireEvent.change(priceInput, { target: { value: "50" } });
    expect(priceInput.value).toBe("50");
  });

  it("debería mostrar un mensaje de éxito cuando se añade un producto correctamente", async () => {
    ApiService.addProduct.mockResolvedValueOnce({
      status: 200,
      message: "Producto añadido con éxito",
    });

    const { getByPlaceholderText, getByText, findByText, getByRole } = render(
      <Router>
        <AddProduct />
      </Router>
    );

    await waitFor(() => getByRole("combobox"));

    const nameInput = getByPlaceholderText("Product Name");
    fireEvent.change(nameInput, { target: { value: "Nuevo Producto" } });

    const descriptionInput = getByPlaceholderText("Product Description");
    fireEvent.change(descriptionInput, { target: { value: "Descripción detallada" } });

    const priceInput = getByPlaceholderText("Price");
    fireEvent.change(priceInput, { target: { value: "50" } });

    const submitButton = getByText("Add");
    fireEvent.click(submitButton);

    const successMessage = await findByText("Producto añadido con éxito");
    expect(successMessage).toBeInTheDocument();
  });

  it("debería mostrar un mensaje de error si la API falla", async () => {
    ApiService.addProduct.mockRejectedValueOnce({
      response: { data: { message: "Error al añadir el producto" } },
    });

    const { getByPlaceholderText, getByText, findByText, getByRole } = render(
      <Router>
        <AddProduct />
      </Router>
    );

    await waitFor(() => getByRole("combobox"));

    const nameInput = getByPlaceholderText("Product Name");
    fireEvent.change(nameInput, { target: { value: "Nuevo Producto" } });

    const descriptionInput = getByPlaceholderText("Product Description");
    fireEvent.change(descriptionInput, { target: { value: "Descripción detallada" } });

    const priceInput = getByPlaceholderText("Price");
    fireEvent.change(priceInput, { target: { value: "50" } });

    const submitButton = getByText("Add");
    fireEvent.click(submitButton);

    const errorMessage = await findByText("Error al añadir el producto");
    expect(errorMessage).toBeInTheDocument();
  });

  it("debería manejar errores desconocidos correctamente", async () => {
    ApiService.addProduct.mockRejectedValueOnce(new Error("Error desconocido"));

    const { getByPlaceholderText, getByText, findByText, getByRole } = render(
      <Router>
        <AddProduct />
      </Router>
    );

    await waitFor(() => getByRole("combobox"));

    const nameInput = getByPlaceholderText("Product Name");
    fireEvent.change(nameInput, { target: { value: "Nuevo Producto" } });

    const descriptionInput = getByPlaceholderText("Product Description");
    fireEvent.change(descriptionInput, { target: { value: "Descripción detallada" } });

    const priceInput = getByPlaceholderText("Price");
    fireEvent.change(priceInput, { target: { value: "50" } });

    const submitButton = getByText("Add");
    fireEvent.click(submitButton);

    const errorMessage = await findByText("Error desconocido");
    expect(errorMessage).toBeInTheDocument();
  });
});
