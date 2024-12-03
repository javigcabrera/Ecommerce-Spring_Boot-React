import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import ApiService from "../service/ApiService";

// Mock de axios
vi.mock("axios");

// Mock de localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("ApiService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe("getHeader", () => {
        it("debería devolver los encabezados con el token de autorización", () => {
            localStorage.setItem("token", "fakeToken");
            const headers = ApiService.getHeader();
            expect(headers.Authorization).toBe("Bearer fakeToken");
            expect(headers["Content-Type"]).toBe("application/json");
        });

        it("debería devolver encabezados sin token si no está presente", () => {
            const headers = ApiService.getHeader();
            expect(headers.Authorization).toBe("Bearer null");
        });
    });

    describe("User", () => {
        it("debería registrar un usuario correctamente", async () => {
            const fakeResponse = { data: { id: 1, name: "John Doe" } };
            axios.post.mockResolvedValue(fakeResponse);

            const result = await ApiService.registerUser({ name: "John Doe" });
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería manejar errores al registrar un usuario", async () => {
            axios.post.mockRejectedValue(new Error("Error de registro"));
            await expect(ApiService.registerUser({ name: "John Doe" })).rejects.toThrow("Error de registro");
        });

        it("debería iniciar sesión correctamente", async () => {
            const fakeResponse = { data: { token: "fakeToken" } };
            axios.post.mockResolvedValue(fakeResponse);

            const result = await ApiService.loginUser({ username: "test", password: "1234" });
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería obtener información del usuario logueado", async () => {
            const fakeResponse = { data: { id: 1, name: "John Doe" } };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getLoggedInUserInfo();
            expect(result).toEqual(fakeResponse.data);
        });
    });

    describe("Product", () => {
        it("debería agregar un producto correctamente", async () => {
            const formData = new FormData();
            const fakeResponse = { data: { id: 1, name: "Producto 1" } };
            axios.post.mockResolvedValue(fakeResponse);

            const result = await ApiService.addProduct(formData);
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería actualizar un producto correctamente", async () => {
            const formData = new FormData();
            const fakeResponse = { data: { id: 1, name: "Producto actualizado" } };
            axios.put.mockResolvedValue(fakeResponse);

            const result = await ApiService.updateProduct(1, formData);
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería obtener todos los productos", async () => {
            const fakeResponse = { data: [{ id: 1, name: "Producto 1" }] };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getAllProducts();
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería buscar productos correctamente", async () => {
            const fakeResponse = { data: [{ id: 1, name: "Producto 1" }] };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.searchProducts("Producto");
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería obtener productos por categoría correctamente", async () => {
            const fakeResponse = { data: [{ id: 1, name: "Producto 1" }] };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getAllProductByCategoryId(1);
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería obtener un producto por ID", async () => {
            const fakeResponse = { data: { id: 1, name: "Producto 1" } };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getProductById(1);
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería eliminar un producto correctamente", async () => {
            const fakeResponse = { data: "Deleted" };
            axios.delete.mockResolvedValue(fakeResponse);

            const result = await ApiService.deleteProduct(1);
            expect(result).toEqual(fakeResponse.data);
        });
    });

    describe("Category", () => {
        it("debería crear una categoría correctamente", async () => {
            const fakeResponse = { data: { id: 1, name: "Categoría 1" } };
            axios.post.mockResolvedValue(fakeResponse);

            const result = await ApiService.createCategory({ name: "Categoría 1" });
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería obtener todas las categorías", async () => {
            const fakeResponse = { data: [{ id: 1, name: "Categoría 1" }] };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getAllCategory();
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería obtener una categoría por ID", async () => {
            const fakeResponse = { data: { id: 1, name: "Categoría 1" } };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getCategoryById(1);
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería actualizar una categoría", async () => {
            const fakeResponse = { data: { id: 1, name: "Categoría actualizada" } };
            axios.put.mockResolvedValue(fakeResponse);

            const result = await ApiService.updateCategory(1, { name: "Categoría actualizada" });
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería eliminar una categoría correctamente", async () => {
            const fakeResponse = { data: "Deleted" };
            axios.delete.mockResolvedValue(fakeResponse);

            const result = await ApiService.deleteCategory(1);
            expect(result).toEqual(fakeResponse.data);
        });
    });

    describe("Order", () => {
        it("debería crear una orden correctamente", async () => {
            const fakeResponse = { data: { id: 1, status: "CREATED" } };
            axios.post.mockResolvedValue(fakeResponse);

            const result = await ApiService.createOrder({ items: [] });
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería obtener todas las órdenes", async () => {
            const fakeResponse = { data: [{ id: 1, status: "CREATED" }] };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getAllOrders();
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería obtener una orden por ID", async () => {
            const fakeResponse = { data: { id: 1, status: "CREATED" } };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getOrderItemById(1);
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería obtener órdenes por estado", async () => {
            const fakeResponse = { data: [{ id: 1, status: "PENDING" }] };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getAllOrderItemsByStatus("PENDING");
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería actualizar el estado de una orden", async () => {
            const fakeResponse = { data: { id: 1, status: "DELIVERED" } };
            axios.put.mockResolvedValue(fakeResponse);

            const result = await ApiService.updateOrderItemStatus(1, "DELIVERED");
            expect(result).toEqual(fakeResponse.data);
        });
    });

    describe("Address", () => {
        it("debería guardar o actualizar una dirección", async () => {
            const fakeResponse = { data: { id: 1, address: "123 Street" } };
            axios.post.mockResolvedValue(fakeResponse);

            const result = await ApiService.saveAndUpdateAddress({ address: "123 Street" });
            expect(result).toEqual(fakeResponse.data);
        });
    });

    describe("Auth", () => {
        it("debería cerrar sesión eliminando token y rol", () => {
            localStorage.setItem("token", "fakeToken");
            localStorage.setItem("role", "ADMIN");

            ApiService.logout();

            expect(localStorage.getItem("token")).toBeNull();
            expect(localStorage.getItem("role")).toBeNull();
        });

        it("debería verificar si el usuario está autenticado", () => {
            localStorage.setItem("token", "fakeToken");
            expect(ApiService.isAuthenticated()).toBe(true);
        });

        it("debería verificar si el usuario no está autenticado", () => {
            expect(ApiService.isAuthenticated()).toBe(false);
        });

        it("debería verificar si el usuario es administrador", () => {
            localStorage.setItem("role", "ADMIN");
            expect(ApiService.isAdmin()).toBe(true);
        });

        it("debería verificar si el usuario no es administrador", () => {
            localStorage.setItem("role", "USER");
            expect(ApiService.isAdmin()).toBe(false);
        });
    });
});
