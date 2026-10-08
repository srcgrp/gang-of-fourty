import { BASEURL } from '../config.js';

const getAndShowCategories = async() => {
    try {
        const response = await fetch(`${BASEURL}/categories.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categories = await response.json();

        const categoryList = document.querySelector('.cat-list');

        categories.forEach(category => {
            categoryList.insertAdjacentHTML(
                'beforeend',
                `
        <li>
          <a class="cat" href="#products">
            <span class="cat-img" role="img" aria-label="${category.name}">${category.emoji}</span>
            <strong>${category.name}</strong>
          </a>
        </li>
        `
            );
        });
    } catch (error) {
        throw new Error(`Error fetching categories`, error);
    }
};

export { getAndShowCategories };