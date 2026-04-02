//window.addEventListener('load');
//сейчас наша страница будет загружаться.

window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  let tab = document.querySelectorAll('.info-header-tab'),
    info = document.querySelector('.info-header'),
    tabContent = document.querySelectorAll('.info-tabcontent');

  function hideTabContent(a) {
    for (let i = a; i < tabContent.length; i++) {
      tabContent[i].classList.remove('show');
      tabContent[i].classList.add('hide');
    }
  }

  hideTabContent(1);

  function showTabContent(b) {
    if (tabContent[b].classList.contains('hide')) {
      tabContent[b].classList.remove('hide');
      tabContent[b].classList.add('show');
    }
  }

  info.addEventListener('click', function (event) {
    let target = event.target;
    if (target && target.classList.contains('info-header-tab')) {
      for (let i = 0; i < tab.length; i++) {
        if (target == tab[i]) {
          hideTabContent(0);
          showTabContent(i);
          break;
        }
      }
    }
  });

  //Timer

  let deadline;

  if (localStorage.getItem('timer_deadline')) {
    deadline = localStorage.getItem('timer_deadline');
  } else {
    // Если зашли первый раз - создаем новую: сейчас + 48 часов
    let date = new Date();
    date.setHours(date.getHours() + 48);
    deadline = date.toString();
    localStorage.setItem('timer_deadline', deadline);
  }

  function getTimeRemaining(endtime) {
    // Разница между дедлайном и текущим моментом в миллисекундах
    const t = Date.parse(endtime) - Date.parse(new Date());

    // Если время вышло, возвращаем нули
    if (t <= 0) {
      return { total: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    const hours = Math.floor(t / (1000 * 60 * 60));

    return {
      total: t,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  // Вспомогательная функция для добавления нуля перед числом (9 -> 09)
  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  function setClock(id, endtime) {
    const timer = document.getElementById(id);
    const hours = timer.querySelector('.hours');
    const minutes = timer.querySelector('.minutes');
    const seconds = timer.querySelector('.seconds');
    const timeInterval = setInterval(updateClock, 1000);

    // Запускаем один раз сразу, чтобы не ждать 1 секунду до первого тика setInterval
    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      hours.textContent = addZero(t.hours);
      minutes.textContent = addZero(t.minutes);
      seconds.textContent = addZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
        hours.textContent = '00';
        minutes.textContent = '00';
        seconds.textContent = '00';
      }
    }
  }

  setClock('timer', deadline);

  //Modal

  let more = document.querySelector('.more'),
    overlay = document.querySelector('.overlay'),
    close = document.querySelector('.popup-close');

  more.addEventListener('click', function () {
    overlay.style.display = 'block';
    this.classList.add('more-splash');
    document.body.style.overflow = 'hidden'; //страница не двигается пока открыто модальное окно.
  });

  close.addEventListener('click', function () {
    overlay.style.display = 'none';
    this.classList.remove('more-splash');
    document.body.style.overflow = '';
  });

  // Закрытие при клике на подложку
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // Закрытие при нажатии Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display === 'block') {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // Form

  // Form - отправка через Fetch API

  const message = {
    loading: 'Загрузка...',
    success: 'Спасибо! Скоро мы с вами свяжемся!',
    failure: 'Что-то пошло не так...',
  };

  const form = document.querySelector('.main-form'),
    inputs = form.querySelectorAll('input'),
    statusMessage = document.createElement('div');

  statusMessage.classList.add('status');
  statusMessage.style.color = '#E2725B';
  statusMessage.style.margin = '30px 10px 10px 10px';

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    form.appendChild(statusMessage);
    statusMessage.textContent = message.loading;

    const formData = new FormData(form);

    // Превращаем FormData в обычный объект для JSON
    const json = JSON.stringify(Object.fromEntries(formData.entries()));

    fetch('https://formspree.io/f/mnjopowl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: json,
    })
      .then((response) => {
        if (response.ok) {
          statusMessage.textContent = message.success;
          form.reset(); // Очистить форму
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        statusMessage.textContent = message.failure;
      })
      .finally(() => {
        // Удаляем сообщение через 6 секунд
        setTimeout(() => {
          statusMessage.remove();
        }, 6000);
      });
  });

  // Slider

  let slideIndex = 1,
    slides = document.querySelectorAll('.slider-item'),
    prev = document.querySelector('.prev'),
    next = document.querySelector('.next'),
    dotsWrap = document.querySelector('.slider-dots'),
    dots = document.querySelectorAll('.dot');

  showSlides(slideIndex);

  function showSlides(n) {
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    slides.forEach((item) => (item.style.display = 'none'));
    // for (let i = 0; i < slides.length; i++) {
    //     slides[i].style.display = 'none';
    // }
    dots.forEach((item) => item.classList.remove('dot-active'));

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].classList.add('dot-active');
  }

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }
  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  prev.addEventListener('click', function () {
    plusSlides(-1);
  });

  next.addEventListener('click', function () {
    plusSlides(1);
  });

  dotsWrap.addEventListener('click', function (event) {
    for (let i = 0; i < dots.length + 1; i++) {
      if (event.target.classList.contains('dot') && event.target == dots[i - 1]) {
        currentSlide(i);
      }
    }
  });

  // Calc

  const persons = document.querySelectorAll('.counter-block-input')[0],
    restDays = document.querySelectorAll('.counter-block-input')[1],
    place = document.getElementById('select'),
    totalValue = document.getElementById('total');

  // Базовая стоимость тура на человека в день (например, для Марокко)
  const basePrice = 4000;

  totalValue.textContent = 0;

  // Создаем ОДНУ функцию для расчета
  const calcTotal = () => {
    const p = +persons.value; // преобразуем в число
    const d = +restDays.value;
    const multiplier = +place.options[place.selectedIndex].value;

    // Проверяем: если поля пустые или введено 0/отрицательное число
    if (persons.value === '' || restDays.value === '' || p <= 0 || d <= 0) {
      totalValue.textContent = 0;
    } else {
      // Формула: (Дни * Люди * Базовая цена) * Коэффициент места
      const result = p * d * basePrice * multiplier;

      // Анимация появления числа
      totalValue.textContent = result;
    }
  };

  // Назначаем функцию на события
  // Используем 'input', чтобы расчет шел сразу ПРИ ВВОДЕ, а не после потери фокуса
  persons.addEventListener('input', calcTotal);
  restDays.addEventListener('input', calcTotal);
  place.addEventListener('change', calcTotal);
});
