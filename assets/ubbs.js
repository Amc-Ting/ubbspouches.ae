
$(document).ready(function() {


  $("#Details-menu-drawer-container").on("click", function() {
    var attr = $(this).attr('open'); 
    $('#smile-ui-lite-launcher-frame-container').hide();
    $('.smile-improved-mobile-launcher').hide();
    
   if (typeof attr !== 'undefined' && attr !== false) {
     $('#smile-ui-lite-launcher-frame-container').show();
      $('.smile-improved-mobile-launcher').show();
     
   }
  });
  

  //   var selectedValue = $("#product_sec input[name='Nicotine Strength']:checked").val();

  //   var selectedImage = $(".thumbnail-slider .thumbnail-list__item:first").attr('data-variant');
  //   var image_1 = $('.thumbnail-slider .thumbnail-list__item[data-variant="' + selectedValue + '"]');
  //   var mainImg = $('.product__media-list .product__media-item.is-active').attr("data-img");

  // console.log(selectedValue, selectedImage);
  // console.log("image 1", image_1);
  //   if (selectedValue === selectedImage) {
  //       image_1.siblings().hide();
  //       image_1.show();
  //   }





  //   $("#product_sec input[name='Nicotine Strength']").on('change', function() {
      
  //       let
  //           variant_id = this.value,
  //           variant_image = $('.thumbnail-slider .thumbnail-list__item[data-variant="' + variant_id + '"]');
  //       console.log("variant_id:",variant_id)
  //       console.log("variant_image:",variant_image)
  //       variant_image.show()
  //       variant_image.first().children(".thumbnail").addClass("active-thumb");
  //       // get all single div except the one which we need to show hide it
  //       $(".thumbnail-slider .thumbnail-list__item").not(variant_image).hide();

  //   });


  var selectedValue = $("#product_sec input[name='Nicotine Strength']:checked").val();

var selectedImage = $(".thumbnail-slider .thumbnail-list__item:first").attr('data-variant');
var image_1 = $('.thumbnail-slider .thumbnail-list__item[data-variant="' + selectedValue + '"]');

// console.log(selectedValue, selectedImage);
// console.log("image_1", image_1);

if (selectedValue === selectedImage) {
    image_1.siblings().hide();
    image_1.show();

    // IMPORTANT: trigger click on thumbnail button
    image_1.first().find('button.thumbnail').trigger('click');
}

$("#product_sec input[name='Nicotine Strength']").on('change', function () {

    let variant_id = this.value,
        variant_image = $('.thumbnail-slider .thumbnail-list__item[data-variant="' + variant_id + '"]');

    // console.log("variant_id:", variant_id);
    // console.log("variant_image:", variant_image);

    // Show only matching thumbnails
    variant_image.show();
    $(".thumbnail-slider .thumbnail-list__item").not(variant_image).hide();

    // Remove active class from all
    $(".thumbnail-slider .thumbnail").removeClass("active-thumb");

    // Add active class to first matching thumb
    let firstThumb = variant_image.first().find("button.thumbnail");

    firstThumb.addClass("active-thumb");

    // VERY IMPORTANT: trigger click so Dawn updates main image
    firstThumb.trigger("click");
});





    var CartBtnValue = $(".card__information .cart_btn_sec .cart_btn span").text();
    var availableVariant = $(".select__select option").attr('data-available');

    $(".card-wrapper.ubbs_pouches .radio_btn input[type='radio']").change(function() {
        var getInputRadioParent = $(this).parents(".radio_btn");
        var Basketbtn = $(this).parents(".card-information").find(".cart_btn_sec .cart_btn span")
        var MediaImg1 = $(this).parents(".card--media").find(".card__media .prod_img_sec .media-1");
        var MediaImg2 = $(this).parents(".card--media").find(".card__media .prod_img_sec .media-2");
        var MediaImg3 = $(this).parents(".card--media").find(".card__media .prod_img_sec .media-3");

        if ($(getInputRadioParent).find("input[type='radio']:checked").attr('data-available') == 'true') {
            Basketbtn.text("Add To Basket");
        } else if ($(getInputRadioParent).find("input[type='radio']:checked").attr('data-available') == 'false') {
            Basketbtn.text("Out of Stock");
        }


        if ($(getInputRadioParent).find("input[type='radio']:checked").attr('value') == '20mg') {
            MediaImg1.show();
            MediaImg2.hide();
            MediaImg3.hide();
        } else if ($(getInputRadioParent).find("input[type='radio']:checked").attr('value') == '14mg') {
          if($(getInputRadioParent).find("input[type='radio']:checked").attr('name').includes("menthol")){
            MediaImg2.hide();
            MediaImg1.show();
            MediaImg3.hide();
          }else{
            MediaImg1.hide();
            MediaImg2.show();
            MediaImg3.hide();
          }  
        } else if ($(getInputRadioParent).find("input[type='radio']:checked").attr('value') == '11mg'){
          if($(getInputRadioParent).find("input[type='radio']:checked").attr('name').includes("menthol")){
            MediaImg1.hide();
            MediaImg2.show();
            MediaImg3.hide();
          }else{
            MediaImg1.hide();
            MediaImg2.hide();
            MediaImg3.show();
          }
        } else if ($(getInputRadioParent).find("input[type='radio']:checked").attr('value') == '6mg'){
            MediaImg1.hide();
            MediaImg2.hide();
            MediaImg3.show();
        }
        //console.log($(getInputRadioParent).find("input[type='radio']:checked").attr('name'));
    });

      //dropdown on  click of account icon starts here //
  $('.account_sec a').click(function(){
    $('.account_sec #login-sec').delay(100).slideDown();
	
});
$('html').click(function(){
if( $('.account_sec #login-sec').is(':visible') ) {
    $('.account_sec #login-sec').slideUp();
}
});

  //dropdown on  click of account icon ends here //

  //  $(".pro_slider").slick({
  //   dots: true,
  //   infinite: true,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   arrows: true,
  //   prevArrow: '<img class="left-arrow" src="https://cdn.shopify.com/s/files/1/0559/7075/8753/files/svgviewer-png-output_1.png?v=1769683613" width="34" height="70">',
  //   nextArrow: '<img class="right-arrow" src="https://cdn.shopify.com/s/files/1/0559/7075/8753/files/svgviewer-png-output.png?v=1769683585" width="34" height="70">',
  //   responsive: [
  //     {
  //       breakpoint: 1199,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 767,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //       },
  //     },
  //   ],
  // });

  $('.blog_slider').slick({
            infinite: false,
            arrows: true,
      prevArrow: '<button class="slide-arrow "><img class="left-arrow" src="https://cdn.shopify.com/s/files/1/0559/7075/8753/files/svgviewer-png-output_1.png?v=1769683613" alt="Left arrow icon | UBBS Pouches - 2" width="34" height="70"></button>',
    nextArrow: '<button class="slide-arrow "><img class="right-arrow" src="https://cdn.shopify.com/s/files/1/0559/7075/8753/files/svgviewer-png-output.png?v=1769683585" alt="Right arrow icon | UBBS Pouches - 2" width="34" height="70"></button>',
            dots: false,
    		autoplay: false,
            slidesToShow: 3,
            slidesToScroll: 1,
      		rows:0,
            responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows:true,
          prevArrow: '<button class="slide-arrow "><img class="left-arrow" src="https://cdn.shopify.com/s/files/1/0559/7075/8753/files/svgviewer-png-output_1.png?v=1769683613" width="34" height="70"></button>',
          nextArrow: '<button class="slide-arrow "><img class="right-arrow" src="https://cdn.shopify.com/s/files/1/0559/7075/8753/files/svgviewer-png-output.png?v=1769683585" width="34" height="70"></button>',
            
        },
      },
      {
        breakpoint: 767,
        settings: "unslick"
      },
    ],
        });

   $('.step-slider').slick({
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    speed: 300,
    slidesToShow: 1
  });
    
$('.responsive1').slick({
  dots: false,
    arrows: true,
  infinite: true,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 1,
   prevArrow:'<button type="button" class="slick-prev pull-left"><svg xmlns="http://www.w3.org/2000/svg" class="abc" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#cccccc" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>',
   nextArrow: "<button type='button' class='slick-next pull-right'><svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"#cccccc\" class=\"w-6 h-6\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8.25 4.5l7.5 7.5-7.5 7.5\" /></svg></button>",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
        arrows: true,
        prevArrow:'<button type="button" class="slick-prev pull-left"><svg xmlns="http://www.w3.org/2000/svg" class="abcd" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#cccccc" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>',
   nextArrow: "<button type='button' class='slick-next pull-right'><svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"#cccccc\" class=\"w-6 h-6\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8.25 4.5l7.5 7.5-7.5 7.5\" /></svg></button>",

        
        }
    },
    {
      breakpoint: 850,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
        arrows: true,
        prevArrow:'<button type="button" class="slick-prev pull-left"><svg xmlns="http://www.w3.org/2000/svg" class="abce" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#cccccc" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>',
        
        nextArrow: "<button type='button' class='slick-next pull-right'><svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"#cccccc\" class=\"w-6 h-6\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8.25 4.5l7.5 7.5-7.5 7.5\" /></svg></button>",

        
        }
    },
    {
      breakpoint: 550,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
        arrows: true,
        prevArrow:'<button type="button" class="slick-prev pull-left"><svg class="p-pp left-arrow slick-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="30px" width="30px" version="1.1" id="Layer_1" viewBox="0 0 493.468 493.468" xml:space="preserve"><g>              <g>                <path d="M246.736,0C110.688,0,0.008,110.692,0.008,246.732c0,136.056,110.68,246.736,246.728,246.736    S493.46,382.788,493.46,246.732C493.46,110.692,382.784,0,246.736,0z M197.592,249.536l94.764,94.776    c1.012,1.004,1.568,2.348,1.568,3.776c0,1.448-0.556,2.784-1.568,3.772l-8.96,8.98c-2.004,2.004-5.568,2.012-7.568,0    l-110.14-110.136c-1.008-1.016-1.556-2.38-1.54-3.932c-0.016-1.476,0.532-2.828,1.536-3.852l110.312-110.304    c1.004-1.004,2.34-1.56,3.776-1.56c1.424,0,2.788,0.556,3.78,1.56l8.968,8.98c2.1,2.06,2.1,5.468,0.004,7.548l-94.932,94.944    C196.084,245.592,196.084,248.024,197.592,249.536z"></path> </g>            </g>          </svg>        </button>',
        nextArrow: '<button type="button" class="slick-next pull-right"><svg class="right-arrow slick-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="30px" width="30px" version="1.1" id="Layer_1" viewBox="0 0 493.456 493.456" xml:space="preserve">              <g>                <g>                  <path d="M246.73,0C110.682,0,0.002,110.68,0.002,246.736c0,136.036,110.68,246.72,246.728,246.72s246.724-110.684,246.724-246.72    C493.454,110.68,382.778,0,246.73,0z M321.138,250.492L210.822,360.804c-2.004,2.008-5.548,2.008-7.556,0l-8.98-8.968    c-2.076-2.084-2.072-5.48,0.004-7.564l94.952-94.94c0.712-0.72,1.116-1.7,1.116-2.732c0-1.016-0.408-2.004-1.116-2.72    l-94.78-94.776c-1-1-1.56-2.344-1.56-3.792c0-1.42,0.556-2.772,1.556-3.764l8.968-8.976c1.004-1,2.352-1.556,3.78-1.556    c1.436-0.008,2.772,0.556,3.776,1.556l110.156,110.152c1.02,1.016,1.572,2.372,1.552,3.936    C322.71,248.116,322.158,249.476,321.138,250.492z"></path>                </g>              </g>            </svg></button>',

        
        }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});


  
  $(".image_with_text_slider").slick({
    arrows: true,
    prevArrow: '<img class="left-arrow" src="https://cdn.shopify.com/s/files/1/0559/7075/8753/files/left_arrow.png?v=1696511384" alt="Left arrow icon | UBBS Pouches" width="34" height="70">',
    nextArrow: '<img class="right-arrow" src="https://cdn.shopify.com/s/files/1/0559/7075/8753/files/right_arrow.png?v=1696511384" alt="Right arrow icon | UBBS Pouches" width="34" height="70">',
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
   autoplaySpeed: 5000
  });
  
      $(".page-wholesale .faq_accordion .faq_header4").click(function () {
    var isFaqActive = $(this).hasClass('faq_active_bg');
      console.lo
    var getFaqParent = $(this).parents('.faq_questions_answer');

    if (isFaqActive) {
       getFaqParent.find('.faq_content').slideUp();
       $(this).removeClass('faq_active_bg');
    } else {
       getFaqParent.find('.faq_content').slideUp();
       $(this).next(".faq_content").slideDown();
       $(".faq_section .faq_header4").removeClass('faq_active_bg');
       $(this).addClass('faq_active_bg');
    }
  });
  
  var winW = $(window).outerWidth();
  if (winW < 989) {
  
   $(".heading-sec > h2").on("click", function() {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    $(this)
                        .siblings(".footer_content")
                        .slideUp(200);
                    $(".heading-sec > h2 span")
                        .removeClass("down_arrow")
                        .addClass("down_arrow");
                } else {
                    $(".heading-sec > h2 span")
                        .removeClass("down_arrow")
                        .addClass("down_arrow");
                    $(this)
                        .find("span")
                        .removeClass("down_arrow")
                        .addClass("down_arrow");
                    $(".heading-sec > h2").removeClass("active");
                    $(this).addClass("active");
                    $(".footer_content").slideUp(200);
                    $(this)
                        .siblings(".footer_content")
                        .slideDown(200);
                }
            });
  }
  
  $(".menu-drawer__menu-item span").on("click", function() {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    $(this).parent()
                        .siblings(".menu-drawer__submenu")
                        .slideUp(200);
                    $(".menu-drawer__menu-item span > i")
                        .removeClass("minus_icon")
                        .addClass("plus_icon");
                } else {
                    $(".menu-drawer__menu-item span > i")
                        .removeClass("minus_icon")
                        .addClass("plus_icon");
                    $(this)
                        .find("i")
                        .removeClass("plus_icon")
                        .addClass("minus_icon");
                    $(".menu-drawer__menu-item span").removeClass("active");
                    $(this).addClass("active");
                    $(".menu-drawer__submenu").slideUp(200);
                    $(this).parent()
                        .siblings(".menu-drawer__submenu")
                        .slideDown(200);
                }
            });


  ScrollOut({
    targets: ".viewportY_Animation",
    cssProps: {
      viewportY: true,
    },
  });

  ScrollOut({
    targets: ".fadeInUp",
    once: true,
  });
  
  ScrollOut({
      targets: ".fadeInUp",
      once: true,
    });

    if (winW < 991) {
      $(".announcement-bar").slick({
    dots: false,
    infinite: true,
   slidesToShow: 1,
   slidesToScroll: 1,
   autoplay: true,
   autoplaySpeed: 5000,
    arrows: false
  });
     
   }

   $(".shop-slider").on('scroll', function() {
        $val = $(this).scrollLeft();

        if ($(this).scrollLeft() + $(this).innerWidth() >= $(this)[0].scrollWidth) {
            $(".nav-next").hide();
        } else {
            $(".nav-next").show();
        }

        if ($val == 0) {
            $(".nav-prev").hide();
        } else {
            $(".nav-prev").show();
        }
    });
    // console.log('init-scroll: ' + $(".nav-next").scrollLeft());
    $(".nav-next").on("click", function() {
        $(this).parent().animate({
            scrollLeft: '+=460'
        }, 200);

    });
    $(".nav-prev").on("click", function() {
        $(this).parent().animate({
            scrollLeft: '-=460'
        }, 200);
    });
  
  
 $(".circle-orbit-container").each(function () {
    $(this).append(`
                <div class="orbit1">
                  <div class="orbit1-cirlces"></div>
                </div>
                <div class="orbit2">
                  <div class="orbit2-cirlces"></div>
                </div>
                <div class="orbit3">
                  <div class="orbit3-cirlces"></div>
                </div>
                <div class="orbit4">
                  <div class="orbit4-cirlces"></div>
                </div>
    `);
  });
  
  
  // let brandColorArray = [
  //     "watermelon",
  //     "berry",
  //     "menthol",
  //     "peppermint",
  //     "spearmint",
  //   ];
  //   //get random color from the brandColorArray
  //   let brandColor =
  //     brandColorArray[Math.floor(Math.random() * brandColorArray.length)];
  //   // =========================banner random color script starts=========================
  //   $("#banner_section .bi_title").addClass(`color_${brandColor}`);
  //   $(`#banner_section .bi_title img`).removeClass("active");
  //   $(`#banner_section .bi_title .${brandColor}`).addClass("active");
  //   // =========================banner random color script ends=========================
  
  
  
     

  $(".contain .tab-contain").hide();
         $(".contain .tab-contain:first-child").show();

         $(".tabs ul li").click(function () {
            $("ul li").removeClass("active");
            $(this).addClass("active");

            $(".contain .tab-contain").hide();
            $($(this).attr("data-list")).show();
         });

         $(".accordion .header4").click(function () {
            var isActive = $(this).hasClass('active_bg');
            var getParent = $(this).parents('.questions_answer');

            if (isActive) {
               getParent.find('.content').slideUp();
               $(this).removeClass('active_bg');
            } else {
               getParent.find('.content').slideUp();
               $(this).next(".content").slideDown();
               $(".accordion .header4").removeClass('active_bg');
               $(this).addClass('active_bg');
            }
         });



   $(function() {
  var list = $('.js-dropdown-list');
  var link = $('.js-link');
  link.click(function(e) {
    e.preventDefault();
    list.slideToggle(200);
  });
  list.find('li').click(function() {
    var text = $(this).html();
    var icon = '<i class="fa fa-chevron-down"></i>';
    link.html(text+icon);
    list.slideToggle(200);
    if (text === '* Reset') {
      link.html('Select one option'+icon);
    }
  });
});




  
});




