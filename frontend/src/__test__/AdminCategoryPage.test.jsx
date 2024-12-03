import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AdminCategoryPage from "../components/admin/AdminCategoryPage";
import ApiService from "../service/ApiService";

// Mock de ApiService ya configurado
vi.mock("../service/ApiService", () => {
  return {
    __esModule: true,
    default: {
      getAllCategory: vi.fn(),
      deleteCategory: vi.fn(),
    },
  };
});

describe("AdminCategoryPage Component", () => {
  beforeEach(() => {
    // Mock para obtener las categorías
    ApiService.getAllCategory.mockResolvedValueOnce({
      categoryList: [
        { id: "1", name: "Categoría 1" },
        { id: "2", name: "Categoría 2" },
      ],
    });

    // Mock para borrar una categoría
    ApiService.deleteCategory.mockResolvedValueOnce({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar correctamente la lista de categorías", async () => {
    render(
      <Router>
        <AdminCategoryPage />
      </Router>
    );

    // Esperar a que las categorías se carguen
    const categories = await waitFor(() => screen.findAllByRole("listitem"));
    expect(categories).toHaveLength(2);
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Categoría 1")).toBeInTheDocument();
    expect(screen.getByText("Categoría 2")).toBeInTheDocument();
  });

  it("debería navegar a la página de añadir categoría al hacer clic en 'Add Category'", () => {
    render(
      <Router>
        <AdminCategoryPage />
      </Router>
    );

    const addButton = screen.getByText("Add Category");
    fireEvent.click(addButton);

    // Aquí debes simular la navegación, dependiendo de cómo esté configurado el router.
    expect(window.location.pathname).toBe("/admin/add-category");
  });

  it("debería navegar a la página de edición de categoría al hacer clic en 'Edit'", async () => {
    render(
      <Router>
        <AdminCategoryPage />
      </Router>
    );

    const editButtons = await waitFor(() => screen.getAllByText("Edit"));
    fireEvent.click(editButtons[0]);

    // Aquí debes simular la navegación, dependiendo de cómo esté configurado el router.
    expect(window.location.pathname).toBe("/admin/edit-category/1");
  });

  it("debería eliminar una categoría tras la confirmación", async () => {
    // Mockear la confirmación
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    render(
      <Router>
        <AdminCategoryPage />
      </Router>
    );

    const deleteButtons = await waitFor(() => screen.getAllByText("Delete"));
    fireEvent.click(deleteButtons[0]);

    // Verificar que se haya llamado a deleteCategory con el ID correcto
    await waitFor(() =>
      expect(ApiService.deleteCategory).toHaveBeenCalledWith("1")
    );

    // Verificar que la lista se haya actualizado (llamando a fetchCategories de nuevo)
    expect(ApiService.getAllCategory).toHaveBeenCalledTimes(2);
  });

  it("no debería eliminar una categoría si la confirmación es cancelada", async () => {
    // Mockear la confirmación
    vi.spyOn(window, "confirm").mockReturnValueOnce(false);

    render(
      <Router>
        <AdminCategoryPage />
      </Router>
    );

    const deleteButtons = await waitFor(() => screen.getAllByText("Delete"));
    fireEvent.click(deleteButtons[0]);

    // Verificar que no se haya llamado a deleteCategory
    await waitFor(() =>
      expect(ApiService.deleteCategory).not.toHaveBeenCalled()
    );
  });
});
