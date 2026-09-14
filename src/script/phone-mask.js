// Маска ввода для российского номера телефона: +7 (___) ___-__-__
const input = document.querySelector('#lead-phone')

if (input) {
  const formatPhone = (rawDigits) => {
    if (!rawDigits) return ''

    const startsWithCode = ['7', '8', '9'].includes(rawDigits[0])
    if (!startsWithCode) {
      return `+7 ${rawDigits.substring(0, 10)}`
    }

    const number = rawDigits[0] === '9' ? rawDigits : rawDigits.substring(1)

    let result = '+7'
    result += number.length ? ' (' + number.substring(0, 3) : ''
    result += number.length >= 4 ? ') ' + number.substring(3, 6) : ''
    result += number.length >= 7 ? '-' + number.substring(6, 8) : ''
    result += number.length >= 9 ? '-' + number.substring(8, 10) : ''
    return result
  }

  const applyMask = () => {
    const digits = input.value.replace(/\D/g, '')
    input.value = formatPhone(digits)
  }

  input.addEventListener('input', () => {
    // Откладываем на следующий тик: при автозаполнении браузер иногда
    // обновляет value в несколько шагов — читаем уже финальное значение,
    // а не промежуточное (из-за этого раньше терялась последняя цифра).
    setTimeout(applyMask, 0)
  })

  // Подстраховка: некоторые сторонние менеджеры паролей/автозаполнители
  // диспатчат только change, без input. applyMask идемпотентна — повторный
  // вызов на уже отформатированном значении ничего не ломает.
  input.addEventListener('change', applyMask)

  // Вставку обрабатываем отдельно и явно: берём текст напрямую из буфера
  // обмена, а не полагаемся на то, как браузер сам допишет value при paste.
  input.addEventListener('paste', (event) => {
    event.preventDefault()
    const pasted = (event.clipboardData || window.clipboardData).getData('text')
    const digits = pasted.replace(/\D/g, '')
    input.value = formatPhone(digits)
  })

  input.addEventListener('keydown', (event) => {
    const digits = input.value.replace(/\D/g, '')
    if (event.key === 'Backspace' && digits.length <= 1) {
      input.value = ''
    }
  })

  input.addEventListener('focus', () => {
    if (!input.value) {
      input.value = '+7 '
    }
  })
}
