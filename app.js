const BASE_URL =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// dropdown fill + flags set
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.innerText = currCode;
    option.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// flag update function
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// exchange rate function (MAIN FIXED PART)
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = 1;
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  const URL = `https://open.er-api.com/v6/latest/${from}`;

  try {
    let response = await fetch(URL);

    let data = await response.json();

    console.log(data); // DEBUG (important)

    let rate = data.rates[to];   // 🔥 THIS IS THE FIX

    if (!rate) {
      msg.innerText = "Rate not available";
      return;
    }

    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${from} = ${finalAmount.toFixed(2)} ${to}`;

  } catch (error) {
    console.log(error);
    msg.innerText = "API error";
  }
};

// button click
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// page load default calculation
window.addEventListener("load", () => {
  updateExchangeRate();
});