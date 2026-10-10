function formatPrice(price) {
  const farsiPrice = new Intl.NumberFormat('fa-IR').format(price)
  return `${farsiPrice} تومان`;
}

function createCard(product) {
  const li = document.createElement("li");

  const icon = document.createElement("span");  
  icon.classList.add("emoji");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = product.emoji;

  const name = document.createElement("h3");
  name.textContent = product.name;

  const meta = document.createElement("p");
  meta.classList.add("meta")
  meta.textContent = product.unit;
  
  const price = document.createElement("p");
  price.classList.add("price")
  price.textContent = formatPrice(product.price);  

  const button = document.createElement("button")
  button.type = "button";
  button.textContent = "+";
  button.setAttribute("aria-label", `افزودن ${product.name} به سبد خرید`)
  
  li.append(icon, name, meta, price, button);
  return li;
}



/* loadProducts */
async function loadProducts() {
  try {
    const res = await fetch("../../api/nope.json");
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
    const products = await res.json();
  } catch (error) {
    console.error(error);
  }
}
loadProducts();