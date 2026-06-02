import { defineConfig } from "vite";

// Application 100 % statique : aucune donnee n'est envoyee a un serveur,
// tout le traitement du CSV se fait dans le navigateur de l'utilisateur.
export default defineConfig({
  base: "./",
  build: {
    target: "es2021",
    outDir: "dist",
    sourcemap: false,
    // ExcelJS (~940 ko) est volontairement isole dans un chunk charge a la
    // demande au moment de generer le fichier : on releve le seuil d'alerte.
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    // ExcelJS et PapaParse sont des dependances CommonJS : on demande a Vite
    // de les pre-bundler pour eviter les soucis d'interop ESM.
    include: ["exceljs", "papaparse"],
  },
});
