// Шапка и меню теперь sticky и вынесены из блока "на всю высоту экрана"
// (иначе position: sticky работал бы только в пределах старого контейнера
// высотой в 1 экран и пропадал бы при скролле дальше). Чтобы блок с героем
// по-прежнему занимал ровно оставшуюся высоту экрана, пишем реальную высоту
// шапки и меню в CSS-переменные --header-h/--nav-h и используем их в calc().
const header = document.querySelector('header')
const nav = document.querySelector('nav')

const setSizes = () => {
  if (header) {
    document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`)
  }
  if (nav) {
    document.documentElement.style.setProperty('--nav-h', `${nav.offsetHeight}px`)
  }
}

if (header || nav) {
  setSizes()
  window.addEventListener('resize', setSizes)

  // Высота может измениться после подгрузки шрифта (переносы строк) —
  // подстраховываемся через ResizeObserver, если он доступен.
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(setSizes)
    if (header) observer.observe(header)
    if (nav) observer.observe(nav)
  }
}
