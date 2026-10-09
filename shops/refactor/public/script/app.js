import { getAndShowCategories } from './funcs/categorys.js';
import { getAndShowOfferProducts, getAndShowAllProducts } from './funcs/products.js'

window.addEventListener('load', () => {
    getAndShowCategories();
    getAndShowOfferProducts();
    getAndShowAllProducts();
});