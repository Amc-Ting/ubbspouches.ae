let selectedSkus = []; // Initialize globally to track selected SKUs
let isModalInitialized = false; // Prevent multiple initializations

document.body.addEventListener("click", function (event) {
  if (event.target.closest(".quick-add-modal") && !isModalInitialized) {
    // Wait for modal content to be fully loaded
    setTimeout(() => {
      variantDescription(); // Initialize variant description logic
      isModalInitialized = true; // Set flag to true after initializing
    }, 100); // Adjust delay if needed
  }
});

function initializeModalScripts() {
  const flavorSelect = document.querySelector(".quick-add-modal #flavor");
  const strengthSelect = document.querySelector(".quick-add-modal #strength");
  const addToDisplayUnitButton = document.querySelector(".quick-add-modal #add-to-display-unit");
  const addToCartButton = document.querySelector(".quick-add-modal #add-to-cart");
  const addedSkusContainer = document.querySelector(".quick-add-modal #added-skus");

  const flavorStrengthMapping = {
    Watermelon: { "6mg": "WM6", "11mg": "WM11", "14mg": "WM14" },
    Spearmint: { "6mg": "SM6", "11mg": "SM11" },
    Peppermint: { "6mg": "PM6", "11mg": "PM11" },
    Berry: { "6mg": "BR6", "11mg": "BR11" },
    Menthol: { "6mg": "MT6", "11mg": "MT11", "14mg": "MT14" },
    "Cola Ice": { "6mg": "CI6", "11mg": "CI11" },
    "Salted Caramel": { "6mg": "SC6", "11mg": "SC11" },
    "Peach Passion": { "4mg": "PP4" },
  };

  let selectedSkus = [];
 

  function updateStrengthOptions() {
    const selectedFlavor = flavorSelect.value;
    const validStrengths = flavorStrengthMapping[selectedFlavor] || {};

    strengthSelect.innerHTML = '<option value="">Select Strength</option>';
    Object.keys(validStrengths).forEach((strength) => {
      const option = document.createElement("option");
      option.value = strength;
      option.textContent = strength;
      strengthSelect.appendChild(option);
    });

    strengthSelect.disabled = !Object.keys(validStrengths).length;
  }

  function updateButtonStates() {
    const canAdd = flavorSelect.value && strengthSelect.value;
    addToDisplayUnitButton.disabled = !canAdd || selectedSkus.length >= 6;
    addToCartButton.disabled = selectedSkus.length < 6;
  }

  function createSkuElement(skuObj) {
    const skuElement = document.createElement("div");
    skuElement.classList.add("sku-item");
    skuElement.textContent = `${skuObj.flavor} ${skuObj.strength} (SKU: ${skuObj.sku})`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.addEventListener("click", function () {
      selectedSkus = selectedSkus.filter((item) => item.sku !== skuObj.sku);
      skuElement.remove();
      updateButtonStates();
    });

    skuElement.appendChild(removeButton);
    return skuElement;
  }

  flavorSelect.addEventListener("change", () => {
    updateStrengthOptions();
    updateButtonStates();
  });

  strengthSelect.addEventListener("change", updateButtonStates);

  addToDisplayUnitButton.addEventListener("click", function () {
    const flavor = flavorSelect.value;
    const strength = strengthSelect.value;
    const sku = flavorStrengthMapping[flavor]?.[strength];

    if (sku && !selectedSkus.some((item) => item.sku === sku) && selectedSkus.length < 6) {
      const skuObj = { flavor, strength, sku };
      selectedSkus.push(skuObj);
      addedSkusContainer.appendChild(createSkuElement(skuObj));
      updateButtonStates();
    }
   
    
  });

  addToCartButton.addEventListener("click", function () {
    if (selectedSkus.length === 6) {
      const productId = 54893577699703; // Replace with the actual product variant ID
      const properties = {};

      selectedSkus.forEach((skuObj, index) => {
        properties[`SKU ${index + 1}`] = `${skuObj.flavor} ${skuObj.strength} (${skuObj.sku}) x 3`;
      });

      fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: productId, quantity: 1, properties }],
        }),
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/cart";
          } else {
            console.error("Failed to add to cart");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  });
}


  function variantDescription() {
const descriptionContainer = document.getElementById('variant_description_sec');
  const radios = document.querySelectorAll('input[name="Pre Filled Options"]');

  // Function to update the description
  function updateDescription() {
    const selectedRadio = document.querySelector('input[name="Pre Filled Options"]:checked');
    if (selectedRadio) {
      descriptionContainer.innerHTML = selectedRadio.dataset.description || 'No description available';
    }
  }

  // Initialize the description on page load
  updateDescription();

  // Add event listener for radio button changes
  radios.forEach(radio => {
    radio.addEventListener('change', updateDescription);
  });
  }
