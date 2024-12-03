import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";
import AdminProductPage from "../components/admin/AdminProductPage";
import ApiService from "../service/ApiService";

// Mock de ApiService
vi.mock("../service/ApiService", () => ({
  __esModule: true,
  default: {
    getAllProducts: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

describe("AdminProductPage Component", () => {
  beforeEach(() => {
    // Mock para obtener los productos
    ApiService.getAllProducts.mockResolvedValueOnce({
      productList: [
        {
          id: "1",
          name: "Producto 1",
          image: "base64encodedimage1",
          imageType: "image/jpeg",
        },
        {
          id: "2",
          name: "Producto 2",
          image: "base64encodedimage2",
          imageType: "image/jpeg",
        },
      ],
    });

    // Mock para borrar un producto
    ApiService.deleteProduct.mockResolvedValueOnce({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar correctamente la lista de productos", async () => {
    render(
      <Router>
        <AdminProductPage />
      </Router>
    );

    // Esperar a que los productos se carguen
    const products = await waitFor(() => screen.findAllByRole("listitem"));
    expect(products).toHaveLength(2);
    expect(screen.getByText("Products")).toBeInTheDocument(); // Cambiado "Productos" por "Products"
    expect(screen.getByText("Producto 1")).toBeInTheDocument();
    expect(screen.getByText("Producto 2")).toBeInTheDocument();
  });

  it("debería navegar a la página de añadir producto al hacer clic en 'Add Product'", () => {
    render(
      <Router>
        <AdminProductPage />
      </Router>
    );

    const addButton = screen.getByText("Add Product"); // Cambiado "Añadir Producto" por "Add Product"
    fireEvent.click(addButton);

    // Simula que la navegación fue llamada (usa el mock del router si es necesario)
    expect(window.location.pathname).toBe("/admin/add-product");
  });

  it("debería navegar a la página de edición de producto al hacer clic en 'Edit'", async () => {
    render(
      <Router>
        <AdminProductPage />
      </Router>
    );

    const editButtons = await waitFor(() => screen.getAllByText("Edit")); // Cambiado "Editar" por "Edit"
    fireEvent.click(editButtons[0]);

    // Simula que la navegación fue llamada (usa el mock del router si es necesario)
    expect(window.location.pathname).toBe("/admin/edit-product/1");
  });

  it("debería eliminar un producto tras la confirmación", async () => {
    // Mockear la confirmación
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    render(
      <Router>
        <AdminProductPage />
      </Router>
    );

    const deleteButtons = await waitFor(() => screen.getAllByText("Delete")); // Cambiado "Borrar" por "Delete"
    fireEvent.click(deleteButtons[0]);

    // Verificar que se haya llamado a deleteProduct con el ID correcto
    await waitFor(() =>
      expect(ApiService.deleteProduct).toHaveBeenCalledWith("1")
    );

    // Verificar que la lista se haya actualizado (llamando a fetchProducts de nuevo)
    expect(ApiService.getAllProducts).toHaveBeenCalledTimes(2);
  });

  it("no debería eliminar un producto si la confirmación es cancelada", async () => {
    // Mockear la confirmación
    vi.spyOn(window, "confirm").mockReturnValueOnce(false);

    render(
      <Router>
        <AdminProductPage />
      </Router>
    );

    const deleteButtons = await waitFor(() => screen.getAllByText("Delete")); // Cambiado "Borrar" por "Delete"
    fireEvent.click(deleteButtons[0]);

    // Verificar que no se haya llamado a deleteProduct
    await waitFor(() =>
      expect(ApiService.deleteProduct).not.toHaveBeenCalled()
    );
  });
});
