import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";
import AdminOrderDetails from "../components/admin/AdminOrderDetails";
import ApiService from "../service/ApiService";

// Mock de ApiService
vi.mock("../service/ApiService", () => ({
  __esModule: true,
  default: {
    getOrderItemById: vi.fn(),
    updateOrderItemStatus: vi.fn(),
  },
}));

// Mock de useParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ itemId: "1" }),
  };
});

describe("AdminOrderDetails Component", () => {
  beforeEach(() => {
    ApiService.getOrderItemById.mockResolvedValueOnce({
      orderItemList: [
        {
          id: "1",
          quantity: 2,
          price: 200.0,
          status: "PENDING",
          createdAt: "2023-01-01T00:00:00Z",
          user: {
            name: "John Doe",
            email: "john@example.com",
            phoneNumber: "123456789",
            role: "USER",
            address: {
              country: "España",
              state: "Madrid",
              city: "Madrid",
              street: "Calle Gran Vía 1",
              zipcode: "28013",
            },
          },
          product: {
            name: "Producto 1",
            description: "Descripción del producto 1",
            price: 100.0,
            image: "base64string",
            imageType: "image/jpeg",
          },
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar correctamente los detalles del pedido", async () => {
    await act(async () => {
      render(
        <Router>
          <AdminOrderDetails />
        </Router>
      );
    });

    // Ajusta el texto para hacer coincidir "Order Details" en inglés.
    expect(await screen.findByRole("heading", { name: /Order Details/i })).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Producto 1")).toBeInTheDocument();
    expect(screen.getByText("Descripción del producto 1")).toBeInTheDocument();
  });

  it("debería permitir cambiar el estado del pedido", async () => {
    await act(async () => {
      render(
        <Router>
          <AdminOrderDetails />
        </Router>
      );
    });

    const select = await screen.findByRole("combobox");
    act(() => {
      fireEvent.change(select, { target: { value: "DELIVERED" } });
    });

    expect(select.value).toBe("DELIVERED");
  });

  it("debería enviar la actualización del estado del pedido", async () => {
    ApiService.updateOrderItemStatus.mockResolvedValueOnce({});

    await act(async () => {
      render(
        <Router>
          <AdminOrderDetails />
        </Router>
      );
    });

    const select = await screen.findByRole("combobox");
    act(() => {
      fireEvent.change(select, { target: { value: "DELIVERED" } });
    });

    const updateButton = screen.getByRole("button", { name: /Update Status/i }); // Cambia el nombre del botón al inglés
    act(() => {
      fireEvent.click(updateButton);
    });

    await waitFor(() =>
      expect(ApiService.updateOrderItemStatus).toHaveBeenCalledWith("1", "DELIVERED")
    );
    expect(await screen.findByText(/The status of the product in the order has been successfully updated./i)).toBeInTheDocument();
  });
});
