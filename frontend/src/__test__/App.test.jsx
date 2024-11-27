import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";

// Mock de componentes
vi.mock("../components/common/Navbar", () => ({
    default: () => <div>Mocked Navbar</div>,
}));
vi.mock("../components/pages/Home", () => ({
    default: () => <div>Mocked Home</div>,
}));
vi.mock("../components/pages/ProductDetailsPage", () => ({
    default: () => <div>Mocked ProductDetailsPage</div>,
}));
vi.mock("../components/pages/CategoryListPage", () => ({
    default: () => <div>Mocked CategoryListPage</div>,
}));
vi.mock("../components/pages/CartPage", () => ({
    default: () => <div>Mocked CartPage</div>,
}));
vi.mock("../components/admin/AdminPage", () => ({
    default: () => <div>Mocked AdminPage</div>,
}));
vi.mock("../components/pages/ProfilePage", () => ({
    default: () => <div>Mocked ProfilePage</div>,
}));
vi.mock("../service/Guard", () => ({
    ProtectedRoute: ({ element }) => element,
    AdminRoute: ({ element }) => element,
}));

describe("App Component", () => {
    it("debería renderizar el componente App correctamente", () => {
        render(<App />);
        expect(screen.getByText("Mocked Navbar")).toBeInTheDocument();
    });

    it("debería renderizar la ruta de inicio correctamente", () => {
        window.history.pushState({}, "Home Page", "/");
        render(<App />);
        expect(screen.getByText("Mocked Home")).toBeInTheDocument();
    });

    it("debería renderizar la ruta /product/:productId correctamente", () => {
        window.history.pushState({}, "Product Details", "/product/1");
        render(<App />);
        expect(screen.getByText("Mocked ProductDetailsPage")).toBeInTheDocument();
    });

    it("debería renderizar la ruta protegida correctamente", () => {
        window.history.pushState({}, "Profile Page", "/profile");
        render(<App />);
        expect(screen.getByText("Mocked ProfilePage")).toBeInTheDocument();
    });

    it("debería renderizar la ruta de administrador correctamente", () => {
        window.history.pushState({}, "Admin Page", "/admin");
        render(<App />);
        expect(screen.getByText("Mocked AdminPage")).toBeInTheDocument();
    });

    it("debería mostrar el carrito en /cart", () => {
        window.history.pushState({}, "Cart Page", "/cart");
        render(<App />);
        expect(screen.getByText("Mocked CartPage")).toBeInTheDocument();
    });

    it("debería mostrar la lista de categorías en /categories", () => {
        window.history.pushState({}, "Category List Page", "/categories");
        render(<App />);
        expect(screen.getByText("Mocked CategoryListPage")).toBeInTheDocument();
    });
});
