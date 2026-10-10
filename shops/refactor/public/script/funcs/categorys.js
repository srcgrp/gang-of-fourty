import { BASEURL } from '../config.js';
import { el } from '../utils/dom.js';
import { showError } from '../components/skeleton.js';

const makeCategory = (category) => {
    const li = el("li")
    const a = el("a", "cat")
    a.setAttribute("href", `#${category.slug}`)

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

const makeSubMenu = (category) => {
    const li = el("li")
    const a = el("a")
    a.setAttribute("href", `#${category.slug}`)
    a.textContent = category.name
    li.append(a)
    return li
}


const fetchCategories = async() => {
    const response = await fetch(`${BASEURL}/categories.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const renderCategoriesInto = async(selector, builder) => {
    const categoryLists = document.querySelectorAll(selector);
    if (!categoryLists.length) return;

    categoryLists.forEach((list) =>
        showError(list, 'در حال بارگیری ...')
    );

    try {
        const categories = await fetchCategories();
        categoryLists.forEach((categoryList) => {
            categoryList.textContent = '';
            categories
                .map(builder)
                .forEach((card) => categoryList.append(card));
        });
    } catch (error) {
        categoryLists.forEach((list) =>
            showError(list, 'خطا در دریافت دسته‌بندی‌ها. لطفاً دوباره تلاش کنید.')
        );
    }
};

const getAndShowCategories = () => renderCategoriesInto('.cat-list', makeCategory);
const getAndShowSubMenus = () => renderCategoriesInto('.sub-menu', makeSubMenu);


export { getAndShowCategories, getAndShowSubMenus };