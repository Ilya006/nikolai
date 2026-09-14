import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig(({ command }) => ({
  // GitHub Pages публикует этот репозиторий как проектную страницу
  // (https://ilya006.github.io/nikolai/), поэтому продакшен-сборке нужен
  // base с именем репозитория — иначе все абсолютные пути (/assets/...,
  // /favicon.svg и т.д.) будут указывать мимо. В dev-режиме base не трогаем,
  // чтобы не менять адрес локального сервера.
  base: command === 'build' ? '/nikolai/' : '/',
  plugins: [
    createHtmlPlugin({
      inject: {
        // Сюда прокидываем данные для EJS-циклов в index.html,
        // например: data: { vehicles, tariffs, faq }
        data: {},
      },
    }),
  ],
}))
