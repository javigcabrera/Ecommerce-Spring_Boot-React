import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";
import AdminOrderPage from "../components/admin/AdminOrderPage";
import ApiService from "../service/ApiService";

// Mock de ApiService
vi.mock("../service/ApiService", () => ({
  __esModule: true,
  default: {
    getAllOrders: vi.fn(),
    getAllOrderItemsByStatus: vi.fn(),
  },
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AdminOrderPage Component", () => {
  beforeEach(() => {
    ApiService.getAllOrders.mockResolvedValueOnce({
      orderItemList: [
        {
          id: "1",
          user: { name: "John Doe" },
          status: "PENDING",
          price: 100.0,
          createdAt: "2023-01-01T00:00:00Z",
        },
        {
          id: "2",
          user: { name: "Jane Smith" },
          status: "DELIVERED",
          price: 50.5,
          createdAt: "2023-02-01T00:00:00Z",
        },
      ],
    });

    ApiService.getAllOrderItemsByStatus.mockResolvedValueOnce({
      orderItemList: [
        {
          id: "1",
          user: { name: "John Doe" },
          status: "PENDING",
          price: 100.0,
          createdAt: "2023-01-01T00:00:00Z",
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar correctamente la lista de pedidos", async () => {
    await act(async () => {
      render(
        <Router>
          <AdminOrderPage />
        </Router>
      );
    });

    const rows = await waitFor(() => screen.getAllByRole("row"));
    expect(rows).toHaveLength(3); // 2 pedidos + encabezado
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("debería filtrar los pedidos por estado", async () => {
    await act(async () => {
      render(
        <Router>
          <AdminOrderPage />
        </Router>
      );
    });

    const select = screen.getByLabelText("Filter by Status"); // Actualizamos el label de búsqueda para que coincida con el texto real
    act(() => {
      fireEvent.change(select, { target: { value: "PENDING" } });
    });

    const rows = await waitFor(() => screen.getAllByRole("row"));
    expect(rows).toHaveLength(2); // 1 pedido + encabezado
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("debería navegar a la página de detalles del pedido al hacer clic en 'Details'", async () => {
    await act(async () => {
      render(
        <Router>
          <AdminOrderPage />
        </Router>
      );
    });

    const detailsButton = await waitFor(() => screen.getAllByText("Details")); // Asegúrate de que el texto coincide
    act(() => {
      fireEvent.click(detailsButton[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/admin/order-details/1");
  });
});
