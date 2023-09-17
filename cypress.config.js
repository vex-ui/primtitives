import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'o2iozx',
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
