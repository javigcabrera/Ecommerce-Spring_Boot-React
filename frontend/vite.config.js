import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom", // Necesario para pruebas con React
        include: ["src/**/*.test.{js,jsx,ts,tsx}"], // Incluye pruebas con extensiones JSX y TSX
        setupFiles: './src/__test__/setupTest.js', // Ruta al archivo de configuración
        coverage: {
            provider: "v8",
            reporter: ["text-summary", "lcov"],
            reportsDirectory: "./coverage",
        },
    },
});

