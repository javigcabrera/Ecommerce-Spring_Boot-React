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

        it("debería devolver encabezados sin autorización si no hay token", () => {
            const headers = ApiService.getHeader();
            expect(headers.Authorization).toBe("Bearer null");
        });
    });

    describe("Auth y User", () => {
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
            localStorage.setItem("token", "fakeToken");
            const fakeResponse = { data: { id: 1, name: "John Doe" } };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getLoggedInUserInfo();
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería manejar errores al obtener información del usuario logueado", async () => {
            axios.get.mockRejectedValue(new Error("Error de usuario"));
            await expect(ApiService.getLoggedInUserInfo()).rejects.toThrow("Error de usuario");
        });
    });

    describe("Products", () => {
        it("debería agregar un producto con form data", async () => {
            const fakeResponse = { data: { id: 1, name: "Product 1" } };
            const formData = new FormData();
            formData.append("name", "Product 1");

            axios.post.mockResolvedValue(fakeResponse);

            const result = await ApiService.addProduct(formData);
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería manejar errores al agregar un producto", async () => {
            const formData = new FormData();
            formData.append("name", "Product 1");

            axios.post.mockRejectedValue(new Error("Error al agregar producto"));
            await expect(ApiService.addProduct(formData)).rejects.toThrow("Error al agregar producto");
        });

        it("debería obtener todos los productos", async () => {
            const fakeResponse = { data: [{ id: 1, name: "Product 1" }] };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getAllProducts();
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería manejar errores al obtener todos los productos", async () => {
            axios.get.mockRejectedValue(new Error("Error al obtener productos"));
            await expect(ApiService.getAllProducts()).rejects.toThrow("Error al obtener productos");
        });
    });

    describe("Category", () => {
        it("debería crear una categoría correctamente", async () => {
            const fakeResponse = { data: { id: 1, name: "Category 1" } };
            axios.post.mockResolvedValue(fakeResponse);

            const result = await ApiService.createCategory({ name: "Category 1" });
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería manejar errores al crear una categoría", async () => {
            axios.post.mockRejectedValue(new Error("Error al crear categoría"));
            await expect(ApiService.createCategory({ name: "Category 1" })).rejects.toThrow("Error al crear categoría");
        });

        it("debería obtener todas las categorías", async () => {
            const fakeResponse = { data: [{ id: 1, name: "Category 1" }] };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getAllCategory();
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería manejar errores al obtener categorías", async () => {
            axios.get.mockRejectedValue(new Error("Error al obtener categorías"));
            await expect(ApiService.getAllCategory()).rejects.toThrow("Error al obtener categorías");
        });
    });

    describe("Orders", () => {
        it("debería crear una orden correctamente", async () => {
            const fakeResponse = { data: { id: 1, status: "CREATED" } };
            axios.post.mockResolvedValue(fakeResponse);

            const result = await ApiService.createOrder({ items: [] });
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería manejar errores al crear una orden", async () => {
            axios.post.mockRejectedValue(new Error("Error al crear orden"));
            await expect(ApiService.createOrder({ items: [] })).rejects.toThrow("Error al crear orden");
        });

        it("debería obtener todas las órdenes", async () => {
            const fakeResponse = { data: [{ id: 1, status: "CREATED" }] };
            axios.get.mockResolvedValue(fakeResponse);

            const result = await ApiService.getAllOrders();
            expect(result).toEqual(fakeResponse.data);
        });

        it("debería manejar errores al obtener órdenes", async () => {
            axios.get.mockRejectedValue(new Error("Error al obtener órdenes"));
            await expect(ApiService.getAllOrders()).rejects.toThrow("Error al obtener órdenes");
        });
    });

    describe("Verificador de autenticación", () => {
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

        it("debería devolver falso si el usuario no es administrador", () => {
            localStorage.setItem("role", "USER");
            expect(ApiService.isAdmin()).toBe(false);
        });
    });
});
