// vite.config.ts
import react from "file:///Users/stefwinterswijk/Repos/Omgevingsbeleid-Frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { visualizer } from "file:///Users/stefwinterswijk/Repos/Omgevingsbeleid-Frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { defineConfig } from "file:///Users/stefwinterswijk/Repos/Omgevingsbeleid-Frontend/node_modules/vite/dist/node/index.js";
import svgrPlugin from "file:///Users/stefwinterswijk/Repos/Omgevingsbeleid-Frontend/node_modules/vite-plugin-svgr/dist/index.js";
import viteTsconfigPaths from "file:///Users/stefwinterswijk/Repos/Omgevingsbeleid-Frontend/node_modules/vite-tsconfig-paths/dist/index.js";
import tailwindcss from "file:///Users/stefwinterswijk/Repos/Omgevingsbeleid-Frontend/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  server: {
    host: "localhost",
    port: 3e3
  },
  preview: {},
  build: {
    target: "esnext",
    outDir: "build",
    rollupOptions: {
      output: {
        dir: "build",
        manualChunks: {
          d3: ["d3"],
          tiptap: [
            "@tiptap/core",
            "@tiptap/extension-bold",
            "@tiptap/extension-bullet-list",
            "@tiptap/extension-document",
            "@tiptap/extension-history",
            "@tiptap/extension-image",
            "@tiptap/extension-italic",
            "@tiptap/extension-link",
            "@tiptap/extension-list-item",
            "@tiptap/extension-ordered-list",
            "@tiptap/extension-paragraph",
            "@tiptap/extension-placeholder",
            "@tiptap/extension-text",
            "@tiptap/extension-underline"
          ],
          leaflet: [
            "leaflet",
            "leaflet-draw",
            "proj4leaflet",
            "react-leaflet"
          ],
          zod: ["zod", "zod-formik-adapter"],
          dompurify: ["dompurify"],
          formik: ["formik"],
          pzh: ["@pzh-ui/components", "@pzh-ui/icons"]
        }
      }
    }
  },
  define: {
    "process.env": {}
  },
  plugins: [
    react(),
    tailwindcss(),
    viteTsconfigPaths(),
    svgrPlugin(),
    visualizer({
      template: "treemap",
      // or sunburst
      gzipSize: true,
      brotliSize: true,
      filename: "analyse.html"
      // will be saved in project's root
    })
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      reporter: ["cobertura", "text"],
      exclude: [
        "node_modules/",
        "src/setupTests.ts",
        "src/api/fetchers.*"
      ]
    },
    restoreMocks: true,
    mockReset: true,
    server: {
      deps: {
        inline: ["@pzh-ui/components"]
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3RlZndpbnRlcnN3aWprL1JlcG9zL09tZ2V2aW5nc2JlbGVpZC1Gcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N0ZWZ3aW50ZXJzd2lqay9SZXBvcy9PbWdldmluZ3NiZWxlaWQtRnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N0ZWZ3aW50ZXJzd2lqay9SZXBvcy9PbWdldmluZ3NiZWxlaWQtRnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHN2Z3JQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tc3ZncidcbmltcG9ydCB2aXRlVHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHNlcnZlcjoge1xuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgcG9ydDogMzAwMCxcbiAgICB9LFxuICAgIHByZXZpZXc6IHt9LFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgICAgIG91dERpcjogJ2J1aWxkJyxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgZGlyOiAnYnVpbGQnLFxuICAgICAgICAgICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICAgICAgICAgICBkMzogWydkMyddLFxuICAgICAgICAgICAgICAgICAgICB0aXB0YXA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdAdGlwdGFwL2NvcmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0B0aXB0YXAvZXh0ZW5zaW9uLWJvbGQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0B0aXB0YXAvZXh0ZW5zaW9uLWJ1bGxldC1saXN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdAdGlwdGFwL2V4dGVuc2lvbi1kb2N1bWVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQHRpcHRhcC9leHRlbnNpb24taGlzdG9yeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQHRpcHRhcC9leHRlbnNpb24taW1hZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0B0aXB0YXAvZXh0ZW5zaW9uLWl0YWxpYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQHRpcHRhcC9leHRlbnNpb24tbGluaycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQHRpcHRhcC9leHRlbnNpb24tbGlzdC1pdGVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdAdGlwdGFwL2V4dGVuc2lvbi1vcmRlcmVkLWxpc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0B0aXB0YXAvZXh0ZW5zaW9uLXBhcmFncmFwaCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQHRpcHRhcC9leHRlbnNpb24tcGxhY2Vob2xkZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0B0aXB0YXAvZXh0ZW5zaW9uLXRleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0B0aXB0YXAvZXh0ZW5zaW9uLXVuZGVybGluZScsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIGxlYWZsZXQ6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWFmbGV0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdsZWFmbGV0LWRyYXcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Byb2o0bGVhZmxldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAncmVhY3QtbGVhZmxldCcsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIHpvZDogWyd6b2QnLCAnem9kLWZvcm1pay1hZGFwdGVyJ10sXG4gICAgICAgICAgICAgICAgICAgIGRvbXB1cmlmeTogWydkb21wdXJpZnknXSxcbiAgICAgICAgICAgICAgICAgICAgZm9ybWlrOiBbJ2Zvcm1payddLFxuICAgICAgICAgICAgICAgICAgICBwemg6IFsnQHB6aC11aS9jb21wb25lbnRzJywgJ0BwemgtdWkvaWNvbnMnXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgICAncHJvY2Vzcy5lbnYnOiB7fSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcmVhY3QoKSxcbiAgICAgICAgdGFpbHdpbmRjc3MoKSxcbiAgICAgICAgdml0ZVRzY29uZmlnUGF0aHMoKSxcbiAgICAgICAgc3ZnclBsdWdpbigpLFxuICAgICAgICB2aXN1YWxpemVyKHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiAndHJlZW1hcCcsIC8vIG9yIHN1bmJ1cnN0XG4gICAgICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgIGJyb3RsaVNpemU6IHRydWUsXG4gICAgICAgICAgICBmaWxlbmFtZTogJ2FuYWx5c2UuaHRtbCcsIC8vIHdpbGwgYmUgc2F2ZWQgaW4gcHJvamVjdCdzIHJvb3RcbiAgICAgICAgfSksXG4gICAgXSxcbiAgICB0ZXN0OiB7XG4gICAgICAgIGdsb2JhbHM6IHRydWUsXG4gICAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgICAgICBzZXR1cEZpbGVzOiAnLi9zcmMvc2V0dXBUZXN0cy50cycsXG4gICAgICAgIGNvdmVyYWdlOiB7XG4gICAgICAgICAgICByZXBvcnRlcjogWydjb2JlcnR1cmEnLCAndGV4dCddLFxuICAgICAgICAgICAgZXhjbHVkZTogW1xuICAgICAgICAgICAgICAgICdub2RlX21vZHVsZXMvJyxcbiAgICAgICAgICAgICAgICAnc3JjL3NldHVwVGVzdHMudHMnLFxuICAgICAgICAgICAgICAgICdzcmMvYXBpL2ZldGNoZXJzLionLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzdG9yZU1vY2tzOiB0cnVlLFxuICAgICAgICBtb2NrUmVzZXQ6IHRydWUsXG4gICAgICAgIHNlcnZlcjoge1xuICAgICAgICAgICAgZGVwczoge1xuICAgICAgICAgICAgICAgIGlubGluZTogWydAcHpoLXVpL2NvbXBvbmVudHMnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sdUJBQXVCO0FBQzlCLE9BQU8saUJBQWlCO0FBR3hCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTLENBQUM7QUFBQSxFQUNWLE9BQU87QUFBQSxJQUNILFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLEtBQUs7QUFBQSxRQUNMLGNBQWM7QUFBQSxVQUNWLElBQUksQ0FBQyxJQUFJO0FBQUEsVUFDVCxRQUFRO0FBQUEsWUFDSjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNKO0FBQUEsVUFDQSxTQUFTO0FBQUEsWUFDTDtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0o7QUFBQSxVQUNBLEtBQUssQ0FBQyxPQUFPLG9CQUFvQjtBQUFBLFVBQ2pDLFdBQVcsQ0FBQyxXQUFXO0FBQUEsVUFDdkIsUUFBUSxDQUFDLFFBQVE7QUFBQSxVQUNqQixLQUFLLENBQUMsc0JBQXNCLGVBQWU7QUFBQSxRQUMvQztBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ0osZUFBZSxDQUFDO0FBQUEsRUFDcEI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLGtCQUFrQjtBQUFBLElBQ2xCLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxNQUNQLFVBQVU7QUFBQTtBQUFBLE1BQ1YsVUFBVTtBQUFBLE1BQ1YsWUFBWTtBQUFBLE1BQ1osVUFBVTtBQUFBO0FBQUEsSUFDZCxDQUFDO0FBQUEsRUFDTDtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0YsU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osVUFBVTtBQUFBLE1BQ04sVUFBVSxDQUFDLGFBQWEsTUFBTTtBQUFBLE1BQzlCLFNBQVM7QUFBQSxRQUNMO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0EsY0FBYztBQUFBLElBQ2QsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLE1BQ0osTUFBTTtBQUFBLFFBQ0YsUUFBUSxDQUFDLG9CQUFvQjtBQUFBLE1BQ2pDO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
