import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";
import { useCart } from "../components/context/CartContext";
import ProductList from "../components/common/ProductList";

// Mock de CartContext
vi.mock("../components/context/CartContext", () => ({
  useCart: vi.fn(),
}));

describe("ProductList Component", () => {
  const mockDispatch = vi.fn();
  const mockCart = [];

  const mockProducts = [
    {
      id: 1,
      name: "Producto 1",
      description: "Descripción del producto 1",
      price: 10.0,
      image: "imagebase64string1",
    },
    {
      id: 2,
      name: "Producto 2",
      description: "Descripción del producto 2",
      price: 20.0,
      image: "imagebase64string2",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useCart.mockReturnValue({
      cart: mockCart,
      dispatch: mockDispatch,
    });
  });

  it("debería renderizar correctamente la lista de productos", () => {
    render(
      <Router>
        <ProductList products={mockProducts} />
      </Router>
    );

    // Verificar que los nombres y descripciones de los productos están presentes
    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(product.description)).toBeInTheDocument();
      expect(
        screen.getByText(`${product.price.toFixed(2)}€`)
      ).toBeInTheDocument();
    });

    // Verificar que los botones "Añadir al carrito" están presentes
    const addToCartButtons = screen.getAllByText("Add to cart");
    expect(addToCartButtons).toHaveLength(mockProducts.length);
  });

  it("debería llamar a 'dispatch' con la acción 'ADD_ITEM' al hacer clic en 'Add to cart'", () => {
    render(
      <Router>
        <ProductList products={mockProducts} />
      </Router>
    );

    const addToCartButton = screen.getAllByText("Add to cart")[0];
    fireEvent.click(addToCartButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_ITEM",
      payload: mockProducts[0],
    });
  });

  it("debería mostrar los controles de cantidad si el producto está en el carrito", () => {
    useCart.mockReturnValue({
      cart: [{ id: 1, quantity: 2 }],
      dispatch: mockDispatch,
    });

    render(
      <Router>
        <ProductList products={mockProducts} />
      </Router>
    );

    const quantityControls = screen.getByText("2");
    expect(quantityControls).toBeInTheDocument();

    // Verificar que los botones + y - están presentes
    const incrementButton = screen.getByText("+");
    const decrementButton = screen.getByText("-");
    expect(incrementButton).toBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();
  });

  it("debería llamar a 'dispatch' con la acción 'INCREMENT_ITEM' al hacer clic en '+'", () => {
    useCart.mockReturnValue({
      cart: [{ id: 1, quantity: 2 }],
      dispatch: mockDispatch,
    });

    render(
      <Router>
        <ProductList products={mockProducts} />
      </Router>
    );

    const incrementButton = screen.getByText("+");
    fireEvent.click(incrementButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "INCREMENT_ITEM",
      payload: mockProducts[0],
    });
  });

  it("debería llamar a 'dispatch' con la acción 'DECREMENT_ITEM' al hacer clic en '-'", () => {
    useCart.mockReturnValue({
      cart: [{ id: 1, quantity: 2 }],
      dispatch: mockDispatch,
    });

    render(
      <Router>
        <ProductList products={mockProducts} />
      </Router>
    );

    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "DECREMENT_ITEM",
      payload: mockProducts[0],
    });
  });

  it("debería llamar a 'dispatch' con la acción 'REMOVE_ITEM' si la cantidad es 1 y se hace clic en '-'", () => {
    useCart.mockReturnValue({
      cart: [{ id: 1, quantity: 1 }],
      dispatch: mockDispatch,
    });

    render(
      <Router>
        <ProductList products={mockProducts} />
      </Router>
    );

    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "REMOVE_ITEM",
      payload: mockProducts[0],
    });
  });
});
