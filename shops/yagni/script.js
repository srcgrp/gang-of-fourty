// task 1- fetch and show  products
// const dairyProducts = document.querySelector(".dairy-products");
// const fruitsVegetablesProducts=document.querySelector(".fruits-vegetables-products")
// const bakeryPastriesProducts=document.querySelector(".bakery-pastries-products")
// const staplesGroceriesProducts=document.querySelector(".staples-groceries-products")
// const beveragesProducts=document.querySelector(".beverages-products")
// const meatProteinProducts=document.querySelector(".meat-protein-products")
// const snacksProducts=document.querySelector(".snacks-products")


// skeletopn for product cards

function renderSkeletons(container, count = 6) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    card.classList.add("product-skeleton");
    card.setAttribute("aria-hidden", "true");

    const thumb = document.createElement("div");
    thumb.classList.add("product-skeleton__thumb");

    const thumbShimmer = document.createElement("div");
    thumbShimmer.classList.add("product-skeleton__shimmer");
    thumb.append(thumbShimmer);

    const info = document.createElement("div");
    info.classList.add("product-skeleton__info");

    const name = document.createElement("div");
    name.classList.add(
      "product-skeleton__shimmer",
      "product-skeleton__name"
    );

    const unit = document.createElement("div");
    unit.classList.add(
      "product-skeleton__shimmer",
      "product-skeleton__unit"
    );

    info.append(name, unit);

    const footer = document.createElement("div");
    footer.classList.add("product-skeleton__footer");

    const pricing = document.createElement("div");
    pricing.classList.add("product-skeleton__pricing");

    const oldPrice = document.createElement("div");
    oldPrice.classList.add(
      "product-skeleton__shimmer",
      "product-skeleton__old-price"
    );

    const currentPrice = document.createElement("div");
    currentPrice.classList.add(
      "product-skeleton__shimmer",
      "product-skeleton__current-price"
    );

    pricing.append(oldPrice, currentPrice);

    const button = document.createElement("div");
    button.classList.add(
      "product-skeleton__shimmer",
      "product-skeleton__button"
    );

    footer.append(pricing, button);
    card.append(thumb, info, footer);
    fragment.append(card);
  }

  container.replaceChildren(fragment);
}



async function renderProducts(categoryId, containerSelector) {
  const container = document.querySelector(containerSelector);

  if (!container) return;

  renderSkeletons(container);

  try {
    const response = await fetch("../../api/products.json");

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    const filteredProducts = products.filter(
      (product) => product.categoryId === categoryId
    );

    // Remove skeletons
    container.replaceChildren();

    filteredProducts.forEach((product) => {
      // Card
      const card = document.createElement("div");
      card.classList.add("product-card");

      // Thumbnail
      const thumb = document.createElement("div");
      thumb.classList.add("product-thumb");

      const emoji = document.createElement("span");
      emoji.classList.add("product-emoji");
      emoji.textContent = product.emoji;
      emoji.setAttribute("role", "img");
      emoji.setAttribute("aria-label", product.name);

      thumb.append(emoji);

      // Product info
      const info = document.createElement("div");
      info.classList.add("product-info");

      const name = document.createElement("span");
      name.classList.add("product-name");
      name.textContent = product.name;

      const unit = document.createElement("span");
      unit.classList.add("product-unit");
      unit.textContent = product.unit;

      info.append(name, unit);

      // Footer
      const footer = document.createElement("div");
      footer.classList.add("product-footer");

      const pricing = document.createElement("div");
      pricing.classList.add("product-pricing");

      const currentPrice = document.createElement("span");
      currentPrice.classList.add("current-price");
      currentPrice.textContent = `${product.price.toLocaleString("fa-IR")} تومان`;

      pricing.append(currentPrice);

      const button = document.createElement("button");
      button.classList.add("add-btn");
      button.type = "button";
      button.setAttribute("aria-label", `افزودن ${product.name} به سبد`);
      button.textContent = "+";

      footer.append(pricing, button);

      // Assemble the card
      card.append(thumb, info, footer);

      // Add card to container
      container.append(card);
    });
  } catch (error) {
    console.error("Error loading products:", error);

    container.replaceChildren();

    const errorMessage = document.createElement("div");
    errorMessage.classList.add("product-error");

    const icon = document.createElement("span");
    icon.classList.add("product-error__icon");
    icon.textContent = "⚠️";
    icon.setAttribute("aria-hidden", "true");

    const message = document.createElement("p");
    message.classList.add("product-error__message");
    message.textContent = "بارگذاری محصولات ناموفق بود";

    const retryButton = document.createElement("button");
    retryButton.classList.add("product-error__retry");
    retryButton.type = "button";
    retryButton.textContent = "تلاش مجدد";

    retryButton.addEventListener("click", () => {
      renderProducts(categoryId, containerSelector);
    });

    errorMessage.append(icon, message, retryButton);
    container.append(errorMessage);
  }
}

renderProducts(1, ".fruitsVegetablesProducts");
renderProducts(2, ".dairyProducts");
renderProducts(3, ".bakeryPastriesProducts");
renderProducts(4, ".staplesGroceriesProducts");
renderProducts(5, ".beveragesProducts");
renderProducts(6, ".meatProteinProducts");
renderProducts(7, ".snacksProducts");
