const topBar = document.querySelector("#top-bar");

const exteriorColorSelector = document.querySelector("#exterior-buttons");
const interiorColorSelector = document.querySelector("#interior-buttons");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const wheelButtonsSection = document.querySelector("#wheel-buttons");
const performanceBtn = document.querySelector("#performance-btn");
const totalPriceElement = document.querySelector("#total-price");
const fullSelfDrivingCheckbox = document.querySelector(
  "#full-self-driving-checkbox"
);
const accessoriesCheckboxes = document.querySelectorAll(
  ".accessory-form-checkbox"
);
const downPaymentElement = document.querySelector("#down-payment");
const monthlyPaymentElement = document.querySelector("#monthly-payment");

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = "Stealth Grey";
const selectedOptions = {
  "Performance Wheels": false,
  "Performance Package": false,
  "Full Self-Driving": false,
};
const pricing = {
  "Performance Wheels": 2500,
  "Performance Package": 5000,
  "Full Self-Driving": 8500,
  Accessories: {
    "Center Console Trays": 35,
    Sunshade: 105,
    "All-Weather Interior Liners": 225,
  },
};

// Update the total price in the UI
const updateTotalPrice = () => {
  //Reset the current price to the base price
  currentPrice = basePrice;
  //Performance wheel options
  if (selectedOptions["Performance Wheels"]) {
    currentPrice += pricing["Performance Wheels"];
  }
  //Performance package options
  if (selectedOptions["Performance Package"]) {
    currentPrice += pricing["Performance Package"];
  }
  //Performance selfdriving options
  if (selectedOptions["Full Self-Driving"]) {
    currentPrice += pricing["Full Self-Driving"];
  }

  //Accessories options
  accessoriesCheckboxes.forEach((checkbox) => {
    //Extract the accessory label
    const accessoryLabel = checkbox
      .closest("label")
      .querySelector("span")
      .textContent.trim();

    const accessoryPrice = pricing["Accessories"][accessoryLabel];

    //Add to current price if accessory is selected
    if (checkbox.checked) {
      currentPrice += accessoryPrice;
    }
  });

  //Update the total price in the UI
  totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;
  updatePaymentBreakdown();
};

//Update the payment breakdown based on the current price
const updatePaymentBreakdown = () => {
  //calculate down payment
  const downPayment = Number((0.15 * currentPrice).toFixed(2));
  downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

  //calculate loan details(assuming 60-month loan at 5.99% interest rate)
  const loanTermMonths = 60;
  const loanInterestRate = 5.99 / 100;
  const loanAmount = currentPrice - downPayment;
  //Monthly payment formula : P*(rate(1+rate)^loanMonths)/((1+rate)^loanMonths -1)
  const monthlyInterestRate = loanInterestRate / 12;
  const monthlyPayment =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  monthlyPaymentElement.textContent = `$${Number(
    monthlyPayment.toFixed(2)
  ).toLocaleString()}`;
};

// Add event listener to window scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle("visible-bar", atTop);
  topBar.classList.toggle("hidden-bar", !atTop);
};

// Image Mapping
const exteriorImages = {
  "Stealth Grey": "./images/model-y-stealth-grey.jpg",
  "Pearl White": "./images/model-y-pearl-white.jpg",
  "Deep Blue": "./images/model-y-deep-blue-metallic.jpg",
  "Solid Black": "./images/model-y-solid-black.jpg",
  "Ultra Red": "./images/model-y-ultra-red.jpg",
  Quicksilver: "./images/model-y-quicksilver.jpg",
};

const interiorImages = {
  Dark: "./images/model-y-interior-dark.jpg",
  Light: "./images/model-y-interior-light.jpg",
};

//Update the exterior image based on color and wheels
const updateExteriorImage = () => {
  const performanceSuffix = selectedOptions["Performance Wheels"]
    ? "-performance"
    : "";
  const colorKey =
    selectedColor in exteriorImages ? selectedColor : "Stealth Grey";

  exteriorImage.src = exteriorImages[colorKey].replace(
    ".jpg",
    `${performanceSuffix}.jpg`
  );
};

//handle color selection
const handleColorButtonClick = (event) => {
  let button;
  if (event.target.tagName === "IMG") {
    button = event.target.closest("button");
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }

  if (button) {
    const buttons = event.currentTarget.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("btn-selected"));
    button.classList.add("btn-selected");

    //change Exterior image
    if (event.currentTarget === exteriorColorSelector) {
      selectedColor = button.querySelector("img").alt;
      updateExteriorImage();
    }

    //change interior image
    if (event.currentTarget === interiorColorSelector) {
      const color = button.querySelector("img").alt;
      interiorImage.src = interiorImages[color];
    }
  }
};

//Wheel Selection
const handleWheelButtonClick = (event) => {
  if (event.target.tagName === "BUTTON") {
    const buttons = wheelButtonsSection.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.classList.remove("bg-gray-700", "text-white");
      btn.classList.add("bg-gray-200");
    });
    //Add selected styles to clicked button
    event.target.classList.add("bg-gray-700", "text-white");

    selectedOptions["Performance Wheels"] =
      event.target.textContent.includes("Performance");

    updateExteriorImage();
    updateTotalPrice();
  }
};

//Performance Package Selection
const handlePerformancePackageClick = () => {
  const isSelected = performanceBtn.classList.toggle("bg-gray-700");
  performanceBtn.classList.toggle("text-white");
  performanceBtn.classList.toggle("border-gray-500");

  //update selected options
  selectedOptions["Performance Package"] = isSelected;
  updateTotalPrice();
};

//Full Self-Driving Selection

const handleFullSelfDrivingClick = () => {
  const isSelected = fullSelfDrivingCheckbox.checked;

  //update selected options
  selectedOptions["Full Self-Driving"] = isSelected;

  //update total price
  updateTotalPrice();
};

//Handle Accessories Checkboxes
accessoriesCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateTotalPrice();
  });
});

//Initial update total price
updateTotalPrice();

//Event listeners
window.addEventListener("scroll", () => requestAnimationFrame(handleScroll));
exteriorColorSelector.addEventListener("click", handleColorButtonClick);
interiorColorSelector.addEventListener("click", handleColorButtonClick);
wheelButtonsSection.addEventListener("click", handleWheelButtonClick);
performanceBtn.addEventListener("click", handlePerformancePackageClick);
fullSelfDrivingCheckbox.addEventListener("change", handleFullSelfDrivingClick);
