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

    expect(getByPlaceholderText("Nombre Producto")).toBeInTheDocument();
    expect(getByPlaceholderText("Descripción Producto")).toBeInTheDocument();
    expect(getByPlaceholderText("Precio")).toBeInTheDocument();
    expect(getByRole("combobox")).toBeInTheDocument();
    expect(getByText("Añadir")).toBeInTheDocument();
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

    const nameInput = getByPlaceholderText("Nombre Producto");
    fireEvent.change(nameInput, { target: { value: "Producto Nuevo" } });
    expect(nameInput.value).toBe("Producto Nuevo");

    const descriptionInput = getByPlaceholderText("Descripción Producto");
    fireEvent.change(descriptionInput, { target: { value: "Descripción nueva" } });
    expect(descriptionInput.value).toBe("Descripción nueva");

    const priceInput = getByPlaceholderText("Precio");
    fireEvent.change(priceInput, { target: { value: "100" } });
    expect(priceInput.value).toBe("100");
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

    const nameInput = getByPlaceholderText("Nombre Producto");
    fireEvent.change(nameInput, { target: { value: "Producto Nuevo" } });

    const descriptionInput = getByPlaceholderText("Descripción Producto");
    fireEvent.change(descriptionInput, { target: { value: "Descripción nueva" } });

    const priceInput = getByPlaceholderText("Precio");
    fireEvent.change(priceInput, { target: { value: "100" } });

    const submitButton = getByText("Añadir");
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

    const nameInput = getByPlaceholderText("Nombre Producto");
    fireEvent.change(nameInput, { target: { value: "Producto Nuevo" } });

    const descriptionInput = getByPlaceholderText("Descripción Producto");
    fireEvent.change(descriptionInput, { target: { value: "Descripción nueva" } });

    const priceInput = getByPlaceholderText("Precio");
    fireEvent.change(priceInput, { target: { value: "100" } });

    const submitButton = getByText("Añadir");
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

    const nameInput = getByPlaceholderText("Nombre Producto");
    fireEvent.change(nameInput, { target: { value: "Producto Nuevo" } });

    const descriptionInput = getByPlaceholderText("Descripción Producto");
    fireEvent.change(descriptionInput, { target: { value: "Descripción nueva" } });

    const priceInput = getByPlaceholderText("Precio");
    fireEvent.change(priceInput, { target: { value: "100" } });

    const submitButton = getByText("Añadir");
    fireEvent.click(submitButton);

    const errorMessage = await findByText("Error desconocido");
    expect(errorMessage).toBeInTheDocument();
  });

  
});
