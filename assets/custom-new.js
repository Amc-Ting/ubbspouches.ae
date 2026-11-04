
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.shop-swiper a, .shop-swiper img, .drawer-shop-grid a, .drawer-shop-grid img').forEach(function(el) {
    el.setAttribute('draggable', 'false');
    el.addEventListener('dragstart', function(event) {
      event.preventDefault();
    });
  });

  const shopSwiper = document.querySelector('.shop-swiper');
  if (shopSwiper && typeof Swiper !== 'undefined') {
    new Swiper('.shop-swiper', {
      slidesPerView: 6,
      spaceBetween: 20,
      loop: false,
      grabCursor: true,
      simulateTouch: true,
      allowTouchMove: true,
      threshold: 8,
      preventClicks: true,
      preventClicksPropagation: true,
      navigation: {
        nextEl: '.shop-swiper .swiper-button-next',
        prevEl: '.shop-swiper .swiper-button-prev',
      },
      pagination: false,
      breakpoints: {
        0:    { slidesPerView: 2 },
        550:  { slidesPerView: 2 },
        768:  { slidesPerView: 2 },
        1024: { slidesPerView: 5 },
        1440: { slidesPerView: 5 },
        1600: { slidesPerView: 6 }
      }
    });
  }

  if (window.jQuery && $.fn.owlCarousel) {
    $(".drawer-shop-grid").owlCarousel({
      loop: true,
      margin: 15,
      nav: true,
      dots: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      freeDrag: false,

      autoplay: false,
      autoplayTimeout: 2500,   // 2.5 sec per slide
      autoplaySpeed: 800,      // smooth transition
      autoplayHoverPause: true, // stop on mouse hover

      responsive: {
        0: {
          items: 2
        },
        480: {
          items: 2
        },
        768: {
          items: 3
        },
        1024: {
          items: 2
        }
      }
    });
  }

  function refreshShopSliders() {
    document.querySelectorAll('.shop-swiper').forEach(function(el) {
      if (el.swiper) {
        el.swiper.update();
      }
    });
    if (window.jQuery) {
      $('.drawer-shop-grid.owl-loaded').trigger('refresh.owl.carousel');
    }
  }

  document.querySelectorAll('header-menu details.mega-menu, .menu-drawer__menu details').forEach(function(details) {
    details.addEventListener('toggle', function() {
      if (!details.open) return;
      window.setTimeout(refreshShopSliders, 300);
    });
  });
});



