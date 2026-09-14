import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig(({ command }) => ({
  // GitHub Pages публикует этот репозиторий как проектную страницу
  // (https://ilya006.github.io/nikolai/), поэтому продакшен-сборке нужен
  // base с именем репозитория — иначе все абсолютные пути (/assets/...,
  // /favicon.svg и т.д.) будут указывать мимо. В dev-режиме base не трогаем,
  // чтобы не менять адрес локального сервера.
  base: command === 'build' ? '/nikolai/' : '/',
  // Минификация CSS/JS у Vite включена по умолчанию (build.minify: 'esbuild') —
  // явно не указываем, чтобы не расходиться с дефолтом при обновлении Vite.
  plugins: [
    createHtmlPlugin({
      // HTML тоже минифицируется — у vite-plugin-html это делает встроенный
      // саб-плагин на html-minifier-terser (убирает пробелы, комментарии,
      // лишние атрибуты). minify: true и так стоит по умолчанию, но пишем
      // явно, чтобы не искать это в исходниках плагина при следующем чтении.
      minify: true,
      inject: {
        // Сюда прокидываем данные для EJS-циклов в index.html,
        // например: data: { vehicles, tariffs, faq }
        data: {},
      },
    }),
  ],
}))
