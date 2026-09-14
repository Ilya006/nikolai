const toggleBtn = document.querySelector('#menu-toggle')
const closeBtn = document.querySelector('#menu-close')
const overlay = document.querySelector('#mobile-menu-overlay')
const menu = document.querySelector('#mobile-menu')
const iconOpen = document.querySelector('#menu-icon-open')
const iconClose = document.querySelector('#menu-icon-close')

if (toggleBtn && menu && overlay) {
  const openMenu = () => {
    menu.classList.remove('translate-x-full')
    menu.setAttribute('aria-hidden', 'false')
    overlay.classList.remove('hidden')
    toggleBtn.setAttribute('aria-expanded', 'true')
    document.body.classList.add('overflow-hidden')
    iconOpen?.classList.add('hidden')
    iconClose?.classList.remove('hidden')
  }

  const closeMenu = () => {
    menu.classList.add('translate-x-full')
    menu.setAttribute('aria-hidden', 'true')
    overlay.classList.add('hidden')
    toggleBtn.setAttribute('aria-expanded', 'false')
    document.body.classList.remove('overflow-hidden')
    iconOpen?.classList.remove('hidden')
    iconClose?.classList.add('hidden')
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true'
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  })

  closeBtn?.addEventListener('click', closeMenu)
  overlay.addEventListener('click', closeMenu)

  // Закрываем при переходе по ссылке (якорь на секцию) и по Esc
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu))
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu()
  })

  // На переходе с мобильного на десктопную ширину меню должно закрыться само,
  // иначе оно останется открытым (с заблокированным скроллом) под десктопным nav
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu()
    }
  })
}
