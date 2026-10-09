import { BASEURL } from '../config.js';
import { makeSkeleton, showError } from '../components/skeleton.js';
import { makeCard } from '../components/productcard.js';


const toFa = (n) =>
    String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹' [d]);


const getAndShowProducts = async() => {
    const track = document.querySelector('.products-track-off');
    if (!track) return;

    const renderSkeletons = (container, count = 1) =>
        container.append(
            ...Array.from({ length: count }, () => makeSkeleton())
        );

    renderSkeletons(track);

    try {
        const res = await fetch(`${BASEURL}/products.json`);
        if (!res.ok) {
            showError(track, 'خطا در دریافت محصولات. لطفاً دوباره تلاش کنید.');
            return;
        }

        const products = await res.json();
        const filtered = products.filter((p) => p.categoryId === 3);

        if (filtered.length === 0) {
            showError(track, 'محصولی برای نمایش وجود ندارد.');
            return;
        }
        const cards = filtered.map(makeCard);
        track.textContent = '';
        cards.forEach((card) => track.append(card));


    } catch {
        showError(track, 'اتصال اینترنت برقرار نیست.');
    }
};

export { getAndShowProducts };