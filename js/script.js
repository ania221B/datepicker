/* globals getComputedStyle */

const form = document.querySelector('.form')
const input = form.querySelector('#date')
const date = new Date()

function createTwoDigitString (number) {
  return number.toString().padStart(2, '0')
}

function createYearMonthIndicatorTimeElement (date) {
  const monthsInAYear = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const year = date.getFullYear()
  const month = date.getMonth()
  const monthName = monthsInAYear[month]
  const datetimeMonth = createTwoDigitString(month + 1)

  return `<time datetime="${year}-${datetimeMonth}">${monthName} ${year}</time>`
}

function createDaysGridHTML (date) {
  const daysGrid = document.createElement('div')
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstWeekdayOfMonth = new Date(date.setDate(1)).getDay()
  const lastDayInMonth = new Date(year, month + 1, 0)
  const daysInAMonth = lastDayInMonth.getDate()
  const datetimeMonth = createTwoDigitString(month + 1)

  for (let day = 1; day <= daysInAMonth; day++) {
    const dayButton = document.createElement('button')
    if (day === 1) {
      dayButton.style.setProperty('--data-column', firstWeekdayOfMonth + 1)
    }
    const datetimeDay = createTwoDigitString(day)

    dayButton.classList.add('button')
    dayButton.setAttribute('type', 'button')
    dayButton.innerHTML = `<time>${day}</time>`
    dayButton.firstElementChild.setAttribute(
      'datetime',
      `${year}-${datetimeMonth}-${datetimeDay}`
    )

    daysGrid.appendChild(dayButton)
  }

  return daysGrid.innerHTML
}

function datetimeToDate (datetime) {
  const [year, month, day = 1] = datetime.split('-').map((num) => parseInt(num))

  return new Date(year, month - 1, day)
}

function createDatepicker (input, date) {
  const datepicker = document.createElement('div')
  const previousNextMonthButtons = `
  <div class="datepicker__buttons">
    <button class="button button-nav button-prev" type="button">
      <svg viewBox="0 0 20 20">
        <path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z"><path/>
      </svg>
    </button>

    <button class="button button-nav button-next" type="button">
      <svg viewBox="0 0 20 20">
        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
      </svg>
    </button>
  </div>`
  const calendar = `
  <div class="datepicker__calendar">
    <div class="calendar__year-month main-grid">
      ${createYearMonthIndicatorTimeElement(date)}
    </div>

    <div class="calendar__day-of-week main-grid">
      <div>Su</div>
      <div>Mo</div>
      <div>Tu</div>
      <div>We</div>
      <div>Th</div>
      <div>Fr</div>
      <div>Sa</div>
    </div>

    <div class="calendar__days main-grid">
      ${createDaysGridHTML(date)}
    </div>
  </div>`

  datepicker.classList.add('datepicker')
  datepicker.innerHTML = `${previousNextMonthButtons}
  ${calendar}`
  datepicker.setAttribute('hidden', 'true')

  const inputRect = input.getBoundingClientRect()
  const fontSize = parseFloat(getComputedStyle(document.body)['font-size'])
  const datepickerButtons = datepicker.querySelector('.datepicker__buttons')
  const datepickerCalendarDays = datepicker.querySelector('.calendar__days')

  function getDatefromYearMonth () {
    const time = datepicker.querySelector(
      '.calendar__year-month'
    ).firstElementChild
    const datetime = time.getAttribute('datetime')
    return datetimeToDate(datetime)
  }

  datepickerButtons.addEventListener('click', (event) => {
    if (!event.target.closest('button')) return
    const currentDate = getDatefromYearMonth()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const targetDate = event.target.closest('.button-prev')
      ? new Date(year, month - 1)
      : new Date(year, month + 1)
    const daysGrid = datepicker.querySelector('.calendar__days')
    const yearMonthIndicator = datepicker.querySelector('.calendar__year-month')
    yearMonthIndicator.innerHTML =
      createYearMonthIndicatorTimeElement(targetDate)
    daysGrid.innerHTML = createDaysGridHTML(targetDate)
  })

  datepickerCalendarDays.addEventListener('click', (event) => {
    if (!event.target.closest('.button')) return
    const button = event.target.closest('.button')
    const buttons = [...button.parentElement.children]
    const time = button.firstElementChild
    const datetime = time.getAttribute('datetime')
    const selectedDate = datetimeToDate(datetime)
    const year = selectedDate.getFullYear()
    const month = createTwoDigitString(selectedDate.getMonth() + 1)
    const day = createTwoDigitString(selectedDate.getDate())
    const formattedDate = `${day}/${month}/${year}`

    buttons.forEach((button) => button.classList.remove('is-selected'))
    button.classList.add('is-selected')
    input.value = formattedDate
  })

  datepicker.style.left = `${inputRect.left}px`
  datepicker.style.top = `${inputRect.bottom + fontSize}px`

  input.addEventListener('click', () => {
    datepicker.removeAttribute('hidden')
  })

  document.addEventListener('click', (event) => {
    if (event.target.closest('.datepicker')) return
    if (event.target.closest('#date') === input) return

    datepicker.setAttribute('hidden', true)
  })

  return datepicker
}

document.body.appendChild(createDatepicker(input, date))
