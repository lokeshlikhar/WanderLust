// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

const checkboxes = document.querySelectorAll(".category-checkbox");
const error = document.getElementById("category-error");

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {

        const checkedBoxes = document.querySelectorAll(".category-checkbox:checked");

        if (checkedBoxes.length > 4) {

            checkbox.checked = false;

            error.style.display = "block";

        } else {

            error.style.display = "none";

        }

    });
});

// Display the 18% GST-inclusive total only while the tax switch is enabled.
const taxSwitch = document.getElementById("flexSwitchCheckDefault");

if (taxSwitch) {
  taxSwitch.addEventListener("change", () => {
    const showTax = taxSwitch.checked;

    document.querySelectorAll(".listing-price").forEach((priceElement) => {
      const basePrice = Number(priceElement.dataset.basePrice);
      const displayedPrice = showTax ? basePrice * 1.18 : basePrice;

      priceElement.textContent = Math.round(displayedPrice).toLocaleString("en-IN");
    });

    document.querySelectorAll(".tax-info").forEach((taxInfo) => {
      taxInfo.style.display = showTax ? "inline" : "none";
    });
  });
}
