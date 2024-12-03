import React from "react";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../components/context/CartContext";

describe("CartContext", () => {
  it("debería proporcionar un carrito vacío inicialmente", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.cart).toEqual([]);
  });

  it("debería agregar un item al carrito", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    const newItem = { id: 1, name: "Producto 1" };

    act(() => {
      result.current.dispatch({ type: "ADD_ITEM", payload: newItem });
    });

    expect(result.current.cart).toEqual([{ ...newItem, quantity: 1 }]);
  });

  it("debería incrementar la cantidad de un item existente", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    const newItem = { id: 1, name: "Producto 1" };

    act(() => {
      result.current.dispatch({ type: "ADD_ITEM", payload: newItem });
      result.current.dispatch({ type: "ADD_ITEM", payload: newItem });
    });

    expect(result.current.cart).toEqual([{ ...newItem, quantity: 2 }]);
  });

  it("debería eliminar un item del carrito", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    const newItem = { id: 1, name: "Producto 1" };

    act(() => {
      result.current.dispatch({ type: "ADD_ITEM", payload: newItem });
      result.current.dispatch({ type: "REMOVE_ITEM", payload: { id: 1 } });
    });

    expect(result.current.cart).toEqual([]);
  });

  it("debería decrementar la cantidad de un item existente", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    const newItem = { id: 1, name: "Producto 1" };

    act(() => {
      result.current.dispatch({ type: "ADD_ITEM", payload: newItem });
      result.current.dispatch({ type: "ADD_ITEM", payload: newItem });
      result.current.dispatch({ type: "DECREMENT_ITEM", payload: { id: 1 } });
    });

    expect(result.current.cart).toEqual([{ ...newItem, quantity: 1 }]);
  });

  it("debería vaciar el carrito", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    const item1 = { id: 1, name: "Producto 1" };
    const item2 = { id: 2, name: "Producto 2" };

    act(() => {
      result.current.dispatch({ type: "ADD_ITEM", payload: item1 });
      result.current.dispatch({ type: "ADD_ITEM", payload: item2 });
      result.current.dispatch({ type: "CLEAR_CART" });
    });

    expect(result.current.cart).toEqual([]);
  });
});
