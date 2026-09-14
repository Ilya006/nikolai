import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: {
        // Сюда прокидываем данные для EJS-циклов в index.html,
        // например: data: { vehicles, tariffs, faq }
        data: {},
      },
    }),
  ],
})
