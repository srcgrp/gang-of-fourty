const dairyContainer= document.querySelector("#dairy-products");
const priceFormatter=new Intl.NumberFormat("fa-IR");

const productImages={
    201: "./asset/breakfast/milk.png",
    202: "./asset/breakfast/cheese.png",
    203: "./asset/breakfast/yogurt.png",
    204: "./asset/breakfast/butter.png",
    205: "./asset/breakfast/ice-cream.webp",
    206: "./asset/breakfast/eggs.png"
}
function createProductCard(product){
  const card=document.createElement("article");
  card.classList.add("product-card");

  const image = document.createElement("img");
  image.src=productImages[product.id];
  image.alt=product.name;
  image.classList.add("product-image");
  image.loading="lazy"

    const name = document.createElement("h3");
    name.textContent = product.name;

    const unit = document.createElement("p");
    unit.classList.add("product-meta");
    unit.textContent = product.unit;

    const price = document.createElement("p");
    price.classList.add("product-price");

    price.textContent = `${priceFormatter.format(product.price)} تومان`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "افزودن به سبد";

    card.append(image, name, unit, price, button);

    return card;
}

async function loadProducts() {
  try{
  const response=await fetch("../../api/products.json");
  if(!response.ok){
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const products=await response.json();
  const dairyProducts=products.filter(products => {
    return products.categoryId===2;
  });
  dairyContainer.replaceChildren();
  dairyProducts.forEach(product => {
    const card=createProductCard(product);
    dairyContainer.appendChild(card);
  });
}catch(error){
  console.error("Failed to load products:", error);
  dairyContainer.replaceChildren();
  const errorMessage=document.createElement("p");
  errorMessage.classList.add("error-message");
  errorMessage.textContent="دریافت محصولات با مشکل مواجه شد. لطفاً دوباره تلاش کنید.";
  errorMessage.setAttribute("role","alert");
  dairyContainer.appendChild(errorMessage);
}finally{
  dairyContainer.setAttribute("aria-busy","false");
}
}
const scrollStartButton=document.querySelector("#dairy-scroll-start");
const scrollEndButton=document.querySelector("#dairy-scroll-end");
scrollStartButton.addEventListener("click", () => {
   dairyContainer.scrollTo({left:  0 , behavior:"smooth"});
});
scrollEndButton.addEventListener("click", () => {
   dairyContainer.scrollTo({left:  -dairyContainer.scrollWidth , behavior:"smooth"});
});
loadProducts();
