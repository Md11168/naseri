/* =====================================================
   AOS
   ===================================================== */

AOS.init({
  duration: 800,
  once: true,
  offset: 60
});


/* =====================================================
   Navbar Scroll
   ===================================================== */

const navbar = document.getElementById('mainNav');

window.addEventListener('scroll', () => {

  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

});


/* =====================================================
   HANORA HERO SLIDER
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');

  const nextBtn = document.querySelector('.slider-arrow.next');
  const prevBtn = document.querySelector('.slider-arrow.prev');

  /* اگر اسلایدر در صفحه نبود */
  if (!slides.length) return;

  let currentSlide = 0;

  let autoSlide;

  const slideDuration = 4500;


  /* ---------------------------------------------
     نمایش اسلاید
     --------------------------------------------- */

  function showSlide(index) {

    /* اگر به آخر رسید */
    if (index >= slides.length) {
      index = 0;
    }

    /* اگر به اول رسید */
    if (index < 0) {
      index = slides.length - 1;
    }

    currentSlide = index;


    /* حذف active از همه اسلایدها */

    slides.forEach((slide) => {
      slide.classList.remove('active');
    });


    /* حذف active از همه نقطه‌ها */

    dots.forEach((dot) => {
      dot.classList.remove('active');
    });


    /* فعال کردن اسلاید جدید */

    slides[currentSlide].classList.add('active');


    /* فعال کردن نقطه */

    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }

  }


  /* ---------------------------------------------
     اسلاید بعدی
     --------------------------------------------- */

  function nextSlide() {
    showSlide(currentSlide + 1);
  }


  /* ---------------------------------------------
     اسلاید قبلی
     --------------------------------------------- */

  function previousSlide() {
    showSlide(currentSlide - 1);
  }


  /* ---------------------------------------------
     شروع حرکت خودکار
     --------------------------------------------- */

  function startAutoSlide() {

    clearInterval(autoSlide);

    autoSlide = setInterval(() => {

      nextSlide();

    }, slideDuration);

  }


  /* ---------------------------------------------
     دکمه بعدی
     --------------------------------------------- */

  if (nextBtn) {

    nextBtn.addEventListener('click', () => {

      nextSlide();

      startAutoSlide();

    });

  }


  /* ---------------------------------------------
     دکمه قبلی
     --------------------------------------------- */

  if (prevBtn) {

    prevBtn.addEventListener('click', () => {

      previousSlide();

      startAutoSlide();

    });

  }


  /* ---------------------------------------------
     کلیک روی نقطه‌ها
     --------------------------------------------- */

  dots.forEach((dot, index) => {

    dot.addEventListener('click', () => {

      showSlide(index);

      startAutoSlide();

    });

  });


  /* ---------------------------------------------
     شروع اولیه
     --------------------------------------------- */

  showSlide(0);

  startAutoSlide();


  /* ---------------------------------------------
     توقف هنگام رفتن موس روی بنر
     --------------------------------------------- */

  const slider = document.querySelector('.hero-slider');

  if (slider) {

    slider.addEventListener('mouseenter', () => {
      clearInterval(autoSlide);
    });


    slider.addEventListener('mouseleave', () => {
      startAutoSlide();
    });

  }


  /* ---------------------------------------------
     پشتیبانی از Swipe موبایل
     --------------------------------------------- */

  let touchStartX = 0;
  let touchEndX = 0;


  slider?.addEventListener('touchstart', (e) => {

    touchStartX = e.changedTouches[0].screenX;

  }, { passive: true });


  slider?.addEventListener('touchend', (e) => {

    touchEndX = e.changedTouches[0].screenX;

    const swipeDistance = touchEndX - touchStartX;


    /* کشیدن به چپ */

    if (swipeDistance < -50) {

      nextSlide();

      startAutoSlide();

    }


    /* کشیدن به راست */

    if (swipeDistance > 50) {

      previousSlide();

      startAutoSlide();

    }

  }, { passive: true });

});


/* =====================================================
   Contact Form — ارسال واقعی به ایمیل از طریق FormSubmit
   ===================================================== */

document.getElementById('contactForm')?.addEventListener('submit', async function(e) {

  e.preventDefault();

  const form = this;
  const msg = document.getElementById('formMessage');
  const btn = document.getElementById('contactSubmitBtn');

  const originalBtnHtml = btn ? btn.innerHTML : '';

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'در حال ارسال... <i class="bi bi-hourglass-split"></i>';
  }

  if (msg) {
    msg.textContent = '';
    msg.style.color = '';
  }

  try {

    const formData = new FormData(form);

    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {

      if (msg) {
        msg.textContent = '✅ پیام شما با موفقیت ارسال شد. با تشکر از شما.';
        msg.style.color = '#e91e63';
      }

      form.reset();

    } else {

      throw new Error('خطا در ارسال');

    }

  } catch (err) {

    if (msg) {
      msg.textContent = '❌ ارسال ناموفق بود. لطفاً دوباره تلاش کنید یا از دایرکت اینستاگرام پیام دهید.';
      msg.style.color = '#c62828';
    }

  } finally {

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalBtnHtml;
    }

    setTimeout(() => {
      if (msg) msg.textContent = '';
    }, 6000);

  }

});


/* =====================================================
   Login Status
   ===================================================== */

window.addEventListener('DOMContentLoaded', () => {

  const user = JSON.parse(
    localStorage.getItem('loggedInUser')
  );

  const navActions = document.getElementById('navActions');


  if (
    user &&
    user.name &&
    navActions
  ) {

    navActions.innerHTML = `

      <span class="fw-semibold ms-2">
        سلام، ${user.name}
      </span>

      <button
        onclick="logout()"
        class="btn-nav outline">
        خروج
      </button>

    `;

  }

});


/* =====================================================
   Logout
   ===================================================== */

function logout() {

  localStorage.removeItem('loggedInUser');

  location.reload();

}
