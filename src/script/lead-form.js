const form = document.querySelector('#lead-form')

if (form) {
  const submitButton = form.querySelector('button[type="submit"]')
  const statusEl = form.querySelector('#lead-form-status')
  const submitButtonDefaultText = submitButton.textContent

  const setStatus = (text, tone) => {
    statusEl.textContent = text
    statusEl.className = tone === 'error' ? 'min-h-5 text-sm text-red-600' : 'min-h-5 text-sm text-emerald-600'
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(form)
    const phone = formData.get('phone')?.toString().trim() ?? ''
    const comment = formData.get('comment')?.toString().trim() ?? ''

    if (!phone) {
      setStatus('Укажите номер телефона', 'error')
      return
    }

    submitButton.disabled = true
    submitButton.textContent = 'Отправляем…'
    setStatus('', 'success')

    try {
      // TODO: заменить на реальный адрес приёма заявок — сейчас бэкенда нет,
      // запрос будет падать с ошибкой (см. обработку catch ниже).
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, comment }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      // TODO: когда подключим Яндекс.Метрику — отметить цель здесь,
      // например: ym(COUNTER_ID, 'reachGoal', 'lead_form_submit')

      setStatus('Заявка отправлена, скоро перезвоним!', 'success')
      form.reset()
    } catch (error) {
      console.error('Не удалось отправить заявку:', error)
      setStatus('Не получилось отправить заявку — позвоните нам напрямую по номеру в шапке сайта', 'error')
    } finally {
      submitButton.disabled = false
      submitButton.textContent = submitButtonDefaultText
    }
  })
}
