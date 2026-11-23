(function () {
    function moveQuantityPopups() {
        document.querySelectorAll('.card-wrapper').forEach(function (card, index) {
            var popup = card.querySelector('.card-quantity-popup');

            if (!popup) return;

            var popupId = 'card-quantity-popup-' + index;

            popup.id = popupId;
            card.dataset.quantityPopupId = popupId;

            document.body.appendChild(popup);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', moveQuantityPopups);
    } else {
        moveQuantityPopups();
    }
})();
(function () {
    'use strict';

    /*
      * ==========================================
      * MONEY FORMATTER
      * ==========================================
      */

    function formatMoney(cents) {
        cents = Number(cents || 0);

        if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
            return Shopify.formatMoney(cents, Shopify.money_format || '£{{amount}}');
        }

        return '£' + (cents / 100).toFixed(2);
    }

    function getPackDiscount(quantity) {
        if (quantity >= 24) return 32.86;
        if (quantity >= 12) return 30;
        if (quantity >= 6) return 20;
        if (quantity >= 3) return 10;

        return 0;
    }
    function getCartQuantity() {
        var cartQuantity = 0;

        // Get quantities from Shopify cart
        if (window.Shopify && window.Shopify.routes) {
            // Cart quantity is maintained by the theme cart counter
            var cartCount = document.querySelector('.cart-count-bubble span[aria-hidden="true"]');

            if (cartCount) {
                cartQuantity = parseInt(cartCount.textContent.trim(), 10) || 0;
            }
        }

        return cartQuantity;
    }
    /*
      * ==========================================
      * CALCULATE PACK PRICE
      * ==========================================
      */

    // function calculatePackPrice(unitPrice, quantity, discount) {
    //   unitPrice = Number(unitPrice || 0);
    //   quantity = Number(quantity || 1);
    //   discount = Number(discount || 0);

    //   var total = unitPrice * quantity;

    //   total = total * (1 - discount / 100);

    //   return Math.round(total);
    // }

    function calculatePackPrice(unitPrice, quantity, discount) {
        unitPrice = Number(unitPrice || 0);
        quantity = Number(quantity || 1);
        discount = Number(discount || 0);

        var discountedUnitPrice = Math.round(
            unitPrice * (1 - discount / 100)
        );

        return discountedUnitPrice * quantity;
    }

    /*
      * ==========================================
      * INITIALIZE CARD
      * ==========================================
      */

    function initializeQuantitySelector(selector) {
        if (!selector) {
            return;
        }

        /*
          * ----------------------------------------
          * Get required elements FIRST
          * ----------------------------------------
          */

        var trigger = selector.querySelector('.card-quantity-trigger');

        var quantityInput = selector.querySelector('.card-quantity-input');

        var card = selector.closest('.card-main-atc');

        var cardWrapper = selector.closest('.card-wrapper');

        var popup = cardWrapper
            ? document.getElementById(cardWrapper.dataset.quantityPopupId)
            : null;
        console.log("shhfsd");
        if (!trigger || !popup || !quantityInput || !card || !cardWrapper) {
            return;
        }

        /*
          * ----------------------------------------
          * Required elements not ready yet
          * ----------------------------------------
          */

        if (!trigger || !popup || !quantityInput || !card) {
            return;
        }

        /*
          * ----------------------------------------
          * Prevent duplicate initialization
          * ----------------------------------------
          */

        if (selector.dataset.quantityInitialized === 'true') {
            return;
        }

        selector.dataset.quantityInitialized = 'true';

        /*
          * ----------------------------------------
          * Get remaining elements
          * ----------------------------------------
          */

        var overlay = popup.querySelector('.card-quantity-popup-overlay');

        var closeButton = popup.querySelector('.card-quantity-close');

        var selectedText = selector.querySelector('.card-quantity-selected');

        var options = popup.querySelectorAll('.card-quantity-option');

        var popupAddButton = popup.querySelector('.card-popup-add-button');

        var popupTotalPrice = popup.querySelector('.card-popup-total-price');

        var customQuantityMinus = popup.querySelector('.card-custom-quantity-minus');

        var customQuantityPlus = popup.querySelector('.card-custom-quantity-plus');

        var customQuantityValue = popup.querySelector('.card-custom-quantity-value');

        /*
          * ----------------------------------------
          * Product form elements
          * ----------------------------------------
          */

        var productForm = card.querySelector('form');

        var submitButton = card.querySelector('.product-form__submit');

        var submitPrice = card.querySelector('.product-form-submit-price');

        var variantInput = card.querySelector('.product-variant-id');

        /*
          * ----------------------------------------
          * Initial state
          * ----------------------------------------
          */

        var currentQuantity = parseInt(quantityInput.value, 10) || 1;

        var currentUnitPrice = parseInt(selector.dataset.unitPrice, 10) || 0;

        var currentVariantId = variantInput ? String(variantInput.value || '') : '';

        /*
          * ========================================
          * PRODUCT VARIANTS
          * ========================================
          */

        var variants = [];

        var variantsScript = card.querySelector('.card-product-variants-json');

        if (variantsScript) {
            try {
                variants = JSON.parse(variantsScript.textContent);
            } catch (error) {
                variants = [];
            }
        }

        /*
          * ========================================
          * OPEN POPUP
          * ========================================
          */

        function openPopup() {
            popup.hidden = false;

            trigger.setAttribute('aria-expanded', 'true');

            document.body.classList.add('card-quantity-popup-open');
            // document.querySelector('.slider.slider--tablet').setAttribute('style')
        }

        /*
          * ========================================
          * CLOSE POPUP
          * ========================================
          */

        function closePopup() {
            popup.hidden = true;

            trigger.setAttribute('aria-expanded', 'false');

            document.body.classList.remove('card-quantity-popup-open');
        }

        /*
          * ========================================
          * OPEN BUTTON
          * ========================================
          */

        trigger.addEventListener('click', function (event) {

            event.preventDefault();
            event.stopPropagation();

            openPopup();
        });

        /*
          * ========================================
          * CLOSE BUTTON
          * ========================================
          */

        if (closeButton) {
            closeButton.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                closePopup();
            });
        }

        /*
          * ========================================
          * OVERLAY
          * ========================================
          */

        if (overlay) {
            overlay.addEventListener('click', function (event) {
                event.preventDefault();

                closePopup();
            });
        }

        /*
          * ========================================
          * UPDATE PRICES
          * ========================================
          */

        function updatePrices() {
            options.forEach(function (option) {
                var quantity = parseInt(option.dataset.quantity, 10) || 1;

                var discount = parseFloat(option.dataset.discount || 0);

                var total = calculatePackPrice(currentUnitPrice, quantity, discount);

                var perCan = quantity > 0 ? Math.round(total / quantity) : 0;

                var priceElement = option.querySelector('.quantity-option-price');

                var perCanElement = option.querySelector('.quantity-option-per-can');

                if (priceElement) {
                    priceElement.textContent = formatMoney(total);
                }

                if (perCanElement) {
                    perCanElement.textContent = formatMoney(perCan) + '/can';
                }
            });

            updateSelectedPrice();
        }

        /*
          * ========================================
          * UPDATE SELECTED PRICE
          * ========================================
          */

        // function updateSelectedPrice() {
        //   var selectedOption = popup.querySelector('.card-quantity-option.is-selected');

        //   if (!selectedOption) {
        //     return;
        //   }

        //   var quantity = parseInt(selectedOption.dataset.quantity, 10) || currentQuantity;

        //   var discount = parseFloat(selectedOption.dataset.discount || 0);

        //   var total = calculatePackPrice(currentUnitPrice, quantity, discount);

        //   if (popupTotalPrice) {
        //     popupTotalPrice.textContent = formatMoney(total);
        //   }

        //   if (submitPrice) {
        //     submitPrice.textContent = formatMoney(total);
        //   }
        // }
        function updateSelectedPrice() {

            // Newly selected quantity
            var quantity = parseInt(currentQuantity, 10) || 1;

            // Existing cart quantity
            var cartQuantity = getCartQuantity();

            // Combined quantity
            var totalQuantity = cartQuantity + quantity;

            // Discount based on combined quantity
            var discount = getPackDiscount(totalQuantity);

            // Calculate price of newly selected quantity
            var total = calculatePackPrice(
                currentUnitPrice,
                quantity,
                discount
            );

            if (popupTotalPrice) {
                popupTotalPrice.textContent = formatMoney(total);
            }

            if (submitPrice) {
                submitPrice.textContent = '- ' + formatMoney(total);
            }

            console.log({
                cartQuantity: cartQuantity,
                selectedQuantity: quantity,
                totalQuantity: totalQuantity,
                discount: discount,
                totalPrice: total
            });
        }
        /*
          * ========================================
          * SELECT PACK / QUANTITY
          * ========================================
          */

        function selectQuantity(quantity) {
            quantity = parseInt(quantity, 10) || 1;

            if (quantity < 1) {
                quantity = 1;
            }

            /*
              * Maximum quantity
              */

            // if (quantity > 24) {
            //   quantity = 24;
            // }

            currentQuantity = quantity;

            /*
              * --------------------------------------
              * Update Shopify quantity
              * --------------------------------------
              */

            quantityInput.value = quantity;

            /*
              * --------------------------------------
              * Notify other theme/app scripts
              * --------------------------------------
              */

            quantityInput.dispatchEvent(
                new Event('change', {
                    bubbles: true,
                })
            );
            updateSelectedPrice();
            /*
              * --------------------------------------
              * Update selected option
              * --------------------------------------
              */

            options.forEach(function (option) {
                var optionQuantity = parseInt(option.dataset.quantity, 10);

                if (optionQuantity === quantity) {
                    option.classList.add('is-selected');
                } else {
                    option.classList.remove('is-selected');
                }
            });

            /*
              * --------------------------------------
              * Update trigger text
              * --------------------------------------
              */

            if (selectedText) {
                selectedText.textContent = quantity + '-Pack';
            }

            /*
              * --------------------------------------
              * Update custom quantity
              * --------------------------------------
              */

            if (customQuantityValue) {
                customQuantityValue.textContent = quantity;
            }

            /*
              * --------------------------------------
              * Update prices
              * --------------------------------------
              */

            updateSelectedPrice();
        }

        /*
          * ========================================
          * PACK OPTIONS
          * ========================================
          */

        options.forEach(function (option) {
            option.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                var quantity = parseInt(this.dataset.quantity, 10) || 1;

                selectQuantity(quantity);

                //closePopup();
            });
        });

        /*
          * ========================================
          * CUSTOM QUANTITY MINUS
          * ========================================
          */

        if (customQuantityMinus) {
            customQuantityMinus.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                var quantity = currentQuantity - 1;

                if (quantity < 1) {
                    quantity = 1;
                }

                selectQuantity(quantity);
                updateSelectedPrice();
            });
        }

        /*
          * ========================================
          * CUSTOM QUANTITY PLUS
          * ========================================
          */

        if (customQuantityPlus) {
            customQuantityPlus.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                var quantity = currentQuantity + 1;

                // if (quantity > 24) {
                //   quantity = 24;
                // }

                selectQuantity(quantity);
                updateSelectedPrice();
                console.log(quantity);
            });
        }

        /*
          * ========================================
          * POPUP ADD TO BASKET
          * ========================================
          *
          * IMPORTANT:
          *
          * Do NOT directly submit using fetch().
          *
          * We use the actual Dawn submit button.
          * This allows Dawn's product-form.js to
          * handle:
          *
          * - AJAX add to cart
          * - cart drawer
          * - cart count
          * - cart drawer sections
          * - cart events
          *
          * ========================================
          */

        if (popupAddButton) {
            popupAddButton.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                /*
                  * Make sure the form exists.
                  */

                if (!productForm || !submitButton) {
                    return;
                }

                /*
                  * --------------------------------------
                  * Get current quantity
                  * --------------------------------------
                  */

                var quantity = parseInt(quantityInput.value, 10) || 1;

                if (quantity < 1) {
                    quantity = 1;
                }

                // if (quantity > 24) {
                //   quantity = 24;
                // }

                /*
                  * --------------------------------------
                  * Set actual Shopify quantity
                  * --------------------------------------
                  */

                quantityInput.value = quantity;

                /*
                  * --------------------------------------
                  * Make sure selected quantity state
                  * is correct.
                  * --------------------------------------
                  */

                currentQuantity = quantity;

                /*
                  * --------------------------------------
                  * Close popup
                  * --------------------------------------
                  */

                closePopup();

                /*
                  * --------------------------------------
                  * IMPORTANT:
                  *
                  * Trigger the REAL Dawn submit
                  * button.
                  *
                  * This is intentionally NOT:
                  *
                  * productForm.submit()
                  *
                  * because that would bypass Dawn's
                  * product-form.js.
                  *
                  * --------------------------------------
                  */

                submitButton.click();
            });
        }

        /*
          * ========================================
          * UPDATE VARIANT
          * ========================================
          */

        function updateVariant() {
            if (!variantInput) {
                return;
            }

            var newVariantId = String(variantInput.value || '');

            if (!newVariantId || newVariantId === currentVariantId) {
                return;
            }

            currentVariantId = newVariantId;

            /*
              * --------------------------------------
              * Find selected variant
              * --------------------------------------
              */

            var matchedVariant = variants.find(function (variant) {
                return String(variant.id) === newVariantId;
            });

            if (!matchedVariant) {
                return;
            }

            /*
              * --------------------------------------
              * Update unit price
              * --------------------------------------
              */

            currentUnitPrice = parseInt(matchedVariant.price, 10) || 0;

            selector.dataset.unitPrice = currentUnitPrice;

            /*
              * --------------------------------------
              * Update variant title
              * --------------------------------------
              */

            var variantTitle = popup.querySelector('.card-quantity-variant');

            if (variantTitle) {
                variantTitle.textContent = matchedVariant.title;
            }

            /*
              * --------------------------------------
              * Update popup image
              * --------------------------------------
              */

            if (matchedVariant.featured_image && matchedVariant.featured_image.src) {
                var popupImage = popup.querySelector('.card-quantity-popup-image');

                if (popupImage) {
                    popupImage.src = matchedVariant.featured_image.src;
                }
            }

            /*
              * --------------------------------------
              * Update prices
              * --------------------------------------
              */

            updatePrices();

            /*
              * --------------------------------------
              * Update submit button
              * --------------------------------------
              */

            if (submitButton) {
                submitButton.disabled = matchedVariant.available === false;
            }
        }

        /*
          * ========================================
          * WATCH VARIANT INPUT
          * ========================================
          *
          * We intentionally do NOT use MutationObserver.
          *
          * The variant input is updated through
          * JavaScript property changes, and therefore
          * watching the "value" HTML attribute is
          * unreliable.
          *
          * ========================================
          */

        if (variantInput) {
            variantInput.addEventListener('change', function () {
                updateVariant();
            });
        }

        /*
          * ========================================
          * GLOBAL VARIANT CHANGE EVENT
          * ========================================
          */

        card.addEventListener('variant:change', function (event) {
            if (!event.detail || !event.detail.variant) {
                return;
            }

            var variant = event.detail.variant;

            currentVariantId = String(variant.id);

            currentUnitPrice = parseInt(variant.price, 10) || 0;

            selector.dataset.unitPrice = currentUnitPrice;

            /*
              * Update variant title
              */

            var variantTitle = popup.querySelector('.card-quantity-variant');

            if (variantTitle) {
                variantTitle.textContent = variant.title;
            }

            /*
              * Update popup image
              */

            if (variant.featured_image && variant.featured_image.src) {
                var popupImage = popup.querySelector('.card-quantity-popup-image');

                if (popupImage) {
                    popupImage.src = variant.featured_image.src;
                }
            }

            /*
              * Update prices
              */

            updatePrices();

            /*
              * Update button
              */

            if (submitButton) {
                submitButton.disabled = variant.available === false;
            }
        });

        /*
          * ========================================
          * INITIALIZE QUANTITY
          * ========================================
          *
          * IMPORTANT:
          *
          * Do NOT force quantity to 1 here.
          *
          * This preserves the current value when
          * Shopify re-renders a section.
          * ========================================
          */

        selectQuantity(currentQuantity);

        /*
          * Update all prices
          */

        updatePrices();

        /*
          * Check variant after initialization.
          */

        setTimeout(function () {
            updateVariant();
        }, 100);
    }

    /*
      * ==========================================
      * INITIALIZE ALL CARDS
      * ==========================================
      */

    function initializeAll() {
        document.querySelectorAll('.card-quantity-selector').forEach(function (selector) {
            initializeQuantitySelector(selector);
        });
    }

    /*
      * ==========================================
      * DOM READY
      * ==========================================
      */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        initializeAll();
    }

    /*
      * ==========================================
      * SHOPIFY SECTION RELOAD
      * ==========================================
      */

    document.addEventListener('shopify:section:load', function () {
        initializeAll();
    });

    /*
      * ==========================================
      * SHOPIFY BLOCK SELECT
      * ==========================================
      */

    document.addEventListener('shopify:block:select', function () {
        initializeAll();
    });

    /*
      * ==========================================
      * ESC KEY
      * ==========================================
      */

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;

        document.querySelectorAll('.card-quantity-popup:not([hidden])').forEach(function (popup) {
            popup.hidden = true;

            var cardWrapper = document.querySelector(
                '.card-wrapper[data-quantity-popup-id="' + popup.id + '"]'
            );

            if (cardWrapper) {
                var trigger = cardWrapper.querySelector('.card-quantity-trigger');

                if (trigger) {
                    trigger.setAttribute('aria-expanded', 'false');
                }
            }
        });

        document.body.classList.remove('card-quantity-popup-open');
    });

    /*
      * ==========================================
      * CLICK OUTSIDE
      * ==========================================
      */

    document.addEventListener('click', function (event) {
        document.querySelectorAll('.card-quantity-popup:not([hidden])').forEach(function (popup) {
            var inner = popup.querySelector('.card-quantity-popup-inner');

            if (inner && !inner.contains(event.target)) {
                popup.hidden = true;

                var cardWrapper = popup.closest('.card-wrapper');

                if (cardWrapper) {
                    var trigger = cardWrapper.querySelector('.card-quantity-trigger');

                    if (trigger) {
                        trigger.setAttribute('aria-expanded', 'false');
                    }
                }

                document.body.classList.remove('card-quantity-popup-open');
            }
        });
    });
})();

(function () {
    'use strict';
    document.addEventListener('change', function (event) {
        /*
          * --------------------------------------
          * Find strength radio
          * --------------------------------------
          */

        var radio = event.target.closest(".card-wrapper input[type='radio'][data-variant]");

        if (!radio) {
            return;
        }

        /*
          * --------------------------------------
          * Only process checked radio
          * --------------------------------------
          */

        if (!radio.checked) {
            return;
        }

        /*
          * --------------------------------------
          * Find product card
          * --------------------------------------
          */

        var card = radio.closest('.card-wrapper');

        if (!card) {
            return;
        }

        /*
          * --------------------------------------
          * Get selected value
          * --------------------------------------
          */

        var selectedValue = radio.value || '';

        /*
          * --------------------------------------
          * Get variant ID
          * --------------------------------------
          */

        var variantId = radio.dataset.variant || '';

        /*
          * --------------------------------------
          * Update popup variant text
          *
          * Example:
          *
          * 20mg -> 20MG / POUCH
          * --------------------------------------
          */

        var popup = document.getElementById(card.dataset.quantityPopupId);

        var variantText = popup
            ? popup.querySelector('.card-quantity-variant')
            : null;

        if (variantText) {
            variantText.textContent = selectedValue;
        }

        /*
          * --------------------------------------
          * Update hidden Shopify variant input
          * --------------------------------------
          */

        var hiddenVariantInput = card.querySelector('input.product-variant-id');

        if (hiddenVariantInput && variantId) {
            /*
              * Update actual value
              */

            hiddenVariantInput.value = variantId;

            /*
              * Tell Shopify/theme JS that
              * the variant changed.
              */

            hiddenVariantInput.dispatchEvent(
                new Event('change', {
                    bubbles: true,
                })
            );

            /*
              * Also dispatch a variant:change
              * event with the selected variant
              * when possible.
              *
              * The first script can then update
              * quantity pricing.
              */

            var variantData = null;

            /*
              * Try to find variant JSON inside
              * this card.
              */

            var variantsScript = card.querySelector('.card-product-variants-json');

            if (variantsScript) {
                try {
                    var variants = JSON.parse(variantsScript.textContent);

                    variantData = variants.find(function (variant) {
                        return String(variant.id) === String(variantId);
                    });
                } catch (error) {
                    variantData = null;
                }
            }

            /*
              * Dispatch variant:change if
              * variant data is available.
              */

            if (variantData) {
                card.dispatchEvent(
                    new CustomEvent('variant:change', {
                        bubbles: true,
                        detail: {
                            variant: variantData,
                        },
                    })
                );
            }
        }
    });
})();