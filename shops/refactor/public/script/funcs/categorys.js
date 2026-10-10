import { BASEURL } from '../config.js';
import { el } from '../utils/dom.js';



const makeCategory = (category) => {
    const li = el("li")
    const a = el("a", "cat")
    a.setAttribute("href", "#products")

    const span = el("span", "cat-img")
    span.setAttribute("role", "img")
    span.setAttribute("aria-label", category.name)
    span.textContent = category.emoji

    const strong = el("strong")
    strong.textContent = category.name

    a.append(span, strong)
    li.append(a)
    return li
}

const getAndShowCategories = async() => {
    const categoryList = document.querySelector('.cat-list');
    if (!categoryList) return;

    try {
        const response = await fetch(`${BASEURL}/categories.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();
        const cards = categories.map(makeCategory);
        categoryList.textContent = '';
        cards.forEach((card) => categoryList.append(card));

    } catch (error) {
        throw new Error('Error fetching categories');
    }
};



export { getAndShowCategories };