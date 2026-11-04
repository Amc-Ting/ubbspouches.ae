console.log('✅ product-form JS FILE LOADED');

if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.variantIdInput.disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton.querySelector('span');

        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading__spinner').classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        function getTierDiscount(totalQty) {
          
          if (totalQty >= 24) return 0.66;
          if (totalQty >= 12) return 0.65;
          if (totalQty >= 6) return 0.50;
          if (totalQty >= 3) return 0.4167;
          return 0;
        }
        
        function updateCartItemPrices(cart) {
          if (!cart || !cart.items) return;
        
          const totalQty = cart.item_count;
          const discount = getTierDiscount(totalQty);

          
        
          // const priceElements = document.querySelectorAll('.single_products .price-item--regular');
        
          // priceElements.forEach((priceElement) => {
          //   const originalPrice = parseFloat(priceElement.dataset.originalPrice);
        
          //   if (!originalPrice) return;
        
          //     function formatPriceByDiscount(newPrice, discount) {
          //       // 66% → always round DOWN to whole number
          //       if (discount === 0.66) {
          //         return Math.floor(newPrice).toFixed(2); // 2.0366 → 2.00
          //       }

          //       // 65% → normal rounding (to nearest)
          //       if (discount === 0.65) {
          //         return (Math.round(newPrice * 100) / 100).toFixed(2); // 2.0965 → 2.10
          //       }

          //       // default → safe rounding down
          //       return (Math.ceil(newPrice * 100) / 100).toFixed(2);
          //     }

          //     let newPrice = originalPrice * (1 - discount);
          //     const formattedPrice = formatPriceByDiscount(newPrice, discount);

          //     if (discount > 0) {
          //       priceElement.innerHTML = `
          //         <s class="original_price_sec">${originalPrice.toFixed(2)}AED</s>
          //         ${formattedPrice}AED
          //       `;
          //     } else {
          //       priceElement.innerHTML = `${formattedPrice}AED`;
          //     }
          // });
        }
        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButtonText.classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }
            // fetch('/cart.js')
            // .then((res) => res.json())
            // .then((cart) => {
            //   updateCartItemPrices(cart);
            // });
            
            const startMarker = CartPerformance.createStartingMarker('add:wait-for-subscribers');
            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              }).then(() => {
                CartPerformance.measureFromMarker('add:wait-for-subscribers', startMarker);
              });
            this.error = false;
            
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    CartPerformance.measure("add:paint-updated-sections", () => {
                      this.cart.renderContents(response);
                    });
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              CartPerformance.measure("add:paint-updated-sections", () => {
                this.cart.renderContents(response);

                // ✅ WAIT for DOM update, then apply pricing
                setTimeout(() => {
                  fetch('/cart.js')
                    .then((res) => res.json())
                    .then((cart) => {
                      updateCartItemPrices(cart);
                    });
                }, 150);

              });
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
            this.querySelector('.loading__spinner').classList.add('hidden');
            
            CartPerformance.measureFromEvent("add:user-action", evt);
          });
          
      
        }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

      toggleSubmitButton(disable = true, text) {
        if (disable) {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (text) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute('disabled');
          this.submitButtonText.textContent = window.variantStrings.addToCart;
        }
      }

      get variantIdInput() {
        return this.form.querySelector('[name=id]');
      }
    }
  );
}

document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".flavour-header").forEach(function (arrow) {

    arrow.addEventListener("click", function (e) {
      e.stopPropagation();

      const card = this.closest(".flavour-card");

      if (card) {
        card.classList.toggle("active");
      }
    });

  });

});
