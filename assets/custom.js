
$(function() {
  
  function renderCartNotificationProduct(key, title, image, variantTitle, itemCount) {
  	return `<div id="shopify-section-cart-notification-product" class="shopify-section">
		<div id="cart-notification-product-${key}" class="cart-item">
          <div class="cart-notification-product__image global-media-settings">
			<img src="${image}" alt="Hard Rock" width="70" height="70" loading="lazy"> </div>
          <div>
            <h3 class="cart-notification-product__name h4 font_heading text_400">${title}</h3>
			${variantTitle ? `<dl>
              <div class="product-option">
                                 
				  <dd>${variantTitle}</dd>              
              </div>
              </dl>`: ``
            }
            <div class="quantity_sec">
          <p>Quantity: (${itemCount})</p>
        </div>
          </div> 
           <div id="discounted_price_sec">                       
            <p>Congratulations! You saved <span id="discount-amount"></span> by buying in bulk!</p>     
        </div>
       </div>
    </div>`
  }
  
  function renderCartBubble(cartItemCount, cartSubtotalPrice) {
  	return `<div id="shopify-section-cart-icon-bubble" class="shopify-section">
       <span> <svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.83 18"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M1.92,1.24c-.44,0-.86,0-1.29,0A.61.61,0,0,1,.05.39.57.57,0,0,1,.6,0H2.5A.6.6,0,0,1,3.1.6c.09.76.16,1.53.24,2.29,0,.07,0,.13,0,.22H16.54a1.22,1.22,0,0,1,1.28,1,2.23,2.23,0,0,1-.06.77c-.47,2.22-.94,4.44-1.43,6.66A1.83,1.83,0,0,1,14.47,13H4.89A1.86,1.86,0,0,1,3,11.3c-.17-1.67-.35-3.33-.52-5s-.35-3.31-.52-5C1.94,1.33,1.93,1.3,1.92,1.24ZM3.5,4.36l.18,1.7.54,5.13a.62.62,0,0,0,.69.6h9.54a.62.62,0,0,0,.68-.55c.34-1.56.67-3.12,1-4.68l.48-2.2Z"></path><path d="M5.58,14.28a1.86,1.86,0,1,1-1.85,1.87A1.87,1.87,0,0,1,5.58,14.28Zm0,2.48a.62.62,0,0,0,0-1.24.62.62,0,0,0,0,1.24Z"></path><path d="M14.89,16.15A1.86,1.86,0,1,1,13,14.28,1.86,1.86,0,0,1,14.89,16.15ZM13,16.76a.62.62,0,0,0,0-1.24.62.62,0,1,0,0,1.24Z"></path></g></g></svg></span><span class="visually-hidden">Cart</span>
		<div class="cart-count-bubble"><span aria-hidden="true">${cartItemCount}</span><span class="visually-hidden"> items</span>\n  
  </div>
  <span id ="total-amount"></span>
    </div>
	`
  }
  
  function getCart(callback) {
    $.ajax({
      type: 'GET',
      url: '/cart.js',
      dataType: 'json', 
      success: function (data) {
      	callback(data)
         // console.log('data1', data);        
        if(data.item_count >= 3){
          document.getElementById("discounted_price_sec").style.display = "block";
        }
        else{
          document.getElementById("discounted_price_sec").style.display = "none";
        }
        const resultd = (data.total_discount/100).toLocaleString('en-UK', { 
  		style: 'currency', 
  		currency: 'GBP' 
    	});
        document.getElementById("discount-amount").innerHTML = resultd;
        
        const resultPrice = (data.total_price/100).toLocaleString('en-UK', { 
  		style: 'currency', 
  		currency: 'GBP' 
    	});
         document.getElementById("total-amount").innerHTML = resultPrice;
      }
    });
  }
  
  $('.cart_btn').on('click', function(e){
    e.preventDefault();
    var cartNotification = new CartNotification();
    cartNotification.setActiveElement(document.activeElement)
    
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: {
        items: [{
          quantity: parseInt($(this).parents(".card-information").find('.quantity__input').val()),
          id: parseInt($(this).parents('.card-information').find(".radio_btn input[type='radio']:checked").attr('data-variant'))
        }]
      },
      dataType: 'json', 
      success: function (data) {
        console.log('data', data)
        
        var items = data.items;
        if (items.length) {
          var key = items[0].key
          var image = items[0].image
          var title = items[0].product_title
          var variantTitle = items[0].variant_title
          var itemCount = items[0].quantity
          
          
          getCart((cartData)=>{
            cartNotification.renderContents({
              ...items[0],
              key: key,
              sections: {
                  "cart-notification-product": renderCartNotificationProduct(key, title, image, variantTitle,itemCount),
                  "cart-notification-button": `<div id="shopify-section-cart-notification-button" class="shopify-section">View my Basket(${cartData.item_count})</div>`,
                  "cart-icon-bubble": renderCartBubble(cartData.item_count)
              }
            })
          })


          if (items[0].id == '7167601934433'){
            let updates = {
              14867362840951: 0,
            };
            
            fetch(window.Shopify.routes.root + 'cart/update.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ updates })
            })
            .then(response => {
              return response.json();
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          }
        }
      } 
    });
  })
})    


$(document).ready(function(){
  // function AddReadMore() {
  //     var readMoreTxt = " Read more";
  //     var readLessTxt = " Read less";

  //     $(".add-read-more").each(function () {
  //         if ($(this).find(".first-section").length) return;

  //         var allstr = $(this).html().trim();
  //         var sentenceEnd = allstr.search(/[\.\!\?](\s|$)/); // Find the first sentence end

  //         if (sentenceEnd !== -1 && sentenceEnd < allstr.length - 1) {
  //             var firstSet = allstr.substring(0, sentenceEnd + 1); // First sentence
  //             var secdHalf = allstr.substring(sentenceEnd + 1).trim(); // Rest of the text

  //             var strtoadd = `<span class='first-section'>${firstSet}</span>
  //                 <span class='read-more' title='Click to Show More'>${readMoreTxt}</span>
  //                 <span class='second-section'> ${secdHalf} </span>
  //                 <span class='read-less' title='Click to Show Less'>${readLessTxt}</span>`;

  //             $(this).html(strtoadd);
  //         }
  //     });

  //     $(document).on("click", ".read-more", function () {
  //         $(this).hide().siblings(".first-section").hide();
  //         $(this).siblings(".second-section, .read-less").show();
  //     });

  //     $(document).on("click", ".read-less", function () {
  //         $(this).siblings(".second-section").hide();
  //       $(this).hide();
  //         $(this).siblings(".first-section, .read-more").show();
  //     });

  //     // Initially hide second-section
  //     $(".second-section").hide();
  // }
  // AddReadMore();

  function AddReadMore() {

    const readMoreTxt = " Read more";
    const readLessTxt = " Read less";
    const showWordCount = 10;

    $(".add-read-more").each(function () {

        // Prevent duplicate processing
        if ($(this).hasClass("read-more-added")) return;

        $(this).addClass("read-more-added");

        let originalText = $(this).text().trim();
        let words = originalText.split(/\s+/);

        // Skip short content
        if (words.length <= showWordCount) return;

        let firstPart = words.slice(0, showWordCount).join(" ");
        let secondPart = words.slice(showWordCount).join(" ");

        let html = `
            <span class="first-section">${firstPart}</span>
            <span class="dots">...</span>
            <span class="second-section">${secondPart}</span>
            <span class="read-more">${readMoreTxt}</span>
            <span class="read-less">${readLessTxt}</span>
        `;

        $(this).html(html);
    });

    // Remove previous handlers before adding
    $(document)
        .off("click", ".read-more")
        .on("click", ".read-more", function () {

            let parent = $(this).closest(".add-read-more");

            parent.find(".dots").hide();
            parent.find(".second-section").css("display", "inline");
            parent.find(".read-less").css("display", "inline");
            parent.find(".read-more").hide();
        });

    $(document)
        .off("click", ".read-less")
        .on("click", ".read-less", function () {

            let parent = $(this).closest(".add-read-more");

            parent.find(".dots").show();
            parent.find(".second-section").hide();
            parent.find(".read-less").hide();
            parent.find(".read-more").css("display", "inline");
        });

    // Initial state
    $(".second-section, .read-less").hide();
  }

  AddReadMore();
  
  // $(".card-wrapper .variant_selection").click(function(event){
  //   event.stopPropagation(); // Prevent click event from bubbling to document
  //   $(this).toggleClass("active");
  //   $(this).next(".coll-fieldset").slideToggle("slow");
  // });

  // $(document).click(function(event){
    
  //   if (!$(event.target).closest(".card-wrapper .variant_selection,.card-wrapper .coll-fieldset").length) {
      
  //     $(".card-wrapper .variant_selection").removeClass("active");
  //     $(".card-wrapper .coll-fieldset").slideUp("slow");
      

  //   }
  // });

  // $('.card-wrapper .coll-fieldset label').click(function(event){
  //    $(".card-wrapper .variant_selection").removeClass("active");
  //     $(".card-wrapper .coll-fieldset").slideUp("slow");
  // });

  
});





document.addEventListener("DOMContentLoaded", function () {
  const stickyBar = document.querySelector(".sticky-nav");
  //  const stickyATC = document.getElementById('StickyATC');
  if (!stickyBar) return;

  let lastScrollTop = 0;
  const scrollThreshold = 5;

  window.addEventListener("scroll", function () {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll <= 50) {
      stickyBar.classList.remove("show");
      
      lastScrollTop = currentScroll;
      return;
    }

    if (Math.abs(currentScroll - lastScrollTop) <= scrollThreshold) return;

    if (currentScroll > lastScrollTop) {
      stickyBar.classList.add("show");
      // stickyATC.classList.add("active");   // down
    } else {
      stickyBar.classList.remove("show"); 
      // stickyATC.classList.remove("active");// up
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
});





document.addEventListener("DOMContentLoaded", function () {

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = [
    { id: "#main_description", name: "Description" },
    { id: "#review_section", name: "Reviews" },
    { id: "#how_to_use_section", name: "How to use" },
    { id: "#recommendation_sec", name: "Related Products" }
  ];

  

  // -----------------------------------
  // CLICK STICKY MENU
  // -----------------------------------
  navLinks.forEach(link => {

    link.addEventListener("click", function(e) {
      e.preventDefault();

      const targetSelector = this.getAttribute("href");
      const targetElement = document.querySelector(targetSelector);

      if (targetElement) {
        const yOffset = -60; // adjust if needed
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }

      // Activate underline immediately
      // setActiveSticky(this.textContent.trim());

      // // Open tab if needed
      // const tabToOpen = this.dataset.openTab;

      // if (tabToOpen) {
      //   const tabButton = document.querySelector('li[data-list="' + tabToOpen + '"]');
      //   if (tabButton) {
      //     tabButton.click();
      //   }
      // }

    });

  });

  // -----------------------------------
  // SYNC WHEN TAB CLICKED MANUALLY
  // -----------------------------------
  // const tabButtons = document.querySelectorAll(".tab-list li");

  // tabButtons.forEach(tab => {
  //   tab.addEventListener("click", function() {

  //     const tabValue = this.getAttribute("data-list");

  //     if (tabValue === ".tab_1") setActiveSticky("Description");
  //     if (tabValue === ".tab_2") setActiveSticky("Reviews");
  //     if (tabValue === ".tab_3") setActiveSticky("FAQs");

  //   });
  // });

  // -----------------------------------
  // HIGHLIGHT ON SCROLL
  // -----------------------------------
window.addEventListener("scroll", function () {

  const yOffset = 60;

  let currentSection = "";

  sections.forEach(section => {
    const el = document.querySelector(section.id);
    if (!el) return;

    const rect = el.getBoundingClientRect();

    if (rect.top <= yOffset + 10 && rect.bottom > yOffset + 10) {
      currentSection = section.name;
    }
  });

  if (currentSection) {
    setActiveSticky(currentSection);
  }
});

  // -----------------------------------
  // SET ACTIVE FUNCTION
  // -----------------------------------
  function setActiveSticky(text) {
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.textContent.trim() === text) {
        link.classList.add("active");
      }
    });
  }

});









