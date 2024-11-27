import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../components/common/Pagination";

describe("Pagination Component", () => {
  const mockOnPageChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  it("debería renderizar correctamente todos los números de página", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    );

    // Verifica que se rendericen los botones con números del 1 al 5
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it("debería destacar la página actual con la clase 'active'", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
    );

    // Verifica que el botón de la página actual (3) tenga la clase 'active'
    const activeButton = screen.getByText("3");
    expect(activeButton).toHaveClass("active");

    // Verifica que los otros botones no tengan la clase 'active'
    for (let i = 1; i <= 5; i++) {
      if (i !== 3) {
        expect(screen.getByText(i.toString())).not.toHaveClass("active");
      }
    }
  });

  it("debería llamar a 'onPageChange' con el número de página correcto al hacer clic", () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />
    );

    // Haz clic en el botón de la página 4
    const pageButton = screen.getByText("4");
    fireEvent.click(pageButton);

    // Verifica que onPageChange haya sido llamado con el número correcto
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
  });

  it("debería manejar correctamente el caso de una sola página", () => {
    render(
      <Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />
    );

    // Verifica que solo se renderice un botón (la página 1)
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("1");

    // Verifica que no llame a onPageChange al hacer clic en la única página
    fireEvent.click(buttons[0]);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });
});
