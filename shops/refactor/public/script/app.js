import { getAndShowCategories } from './funcs/categorys.js';
import { getAndShowProducts } from './funcs/products.js'

window.addEventListener('load', () => {
    getAndShowCategories();
    getAndShowProducts()
});