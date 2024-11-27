import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock de `createRoot` para capturar llamadas
import * as ReactDomClient from 'react-dom/client';
vi.mock('react-dom/client', () => {
  const render = vi.fn();
  return {
    createRoot: vi.fn(() => ({ render })),
    __esModule: true, // Permite exportar correctamente
    render,
  };
});

describe('Main file', () => {
  let rootElement;

  beforeEach(() => {
    // Crear un nodo DOM simulado para `#root`
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    // Limpiar el DOM después de cada prueba
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('debería montar la aplicación sin errores', async () => {
    // Importar dinámicamente `main.jsx`
    await import('../main.jsx');

    // Verificar que `createRoot` fue llamado con el elemento correcto
    expect(ReactDomClient.createRoot).toHaveBeenCalledWith(rootElement);

    // Verificar que `render` fue llamado con un componente React válido
    const mockRender = ReactDomClient.createRoot().render;
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Verificar el contenido renderizado (opcional)
    expect(mockRender.mock.calls[0][0]).toBeDefined();
  });
});
