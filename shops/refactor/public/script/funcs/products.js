import { BASEURL } from '../config.js';
import { makeSkeleton, showError } from '../components/skeleton.js';
import { makeCard } from '../components/productcard.js';


const toFa = (n) =>
    String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹' [d]);


const getAndShowOfferProducts = async() => {
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


const getAndShowAllProducts = () => {
    Promise.all([
            fetch(`${BASEURL}/products.json`),
            fetch(`${BASEURL}/stock.json`),
            fetch(`${BASEURL}/offers.json`),
        ])
        .then(responses => {
            responses.forEach(response => {
                if (!response.ok) {
                    showError('خطا در دریافت محصولات. لطفاً دوباره تلاش کنید.');
                }
            });
            return Promise.all(responses.map(response => response.json()));
        })
        .then(([products, stock, offers]) => {
            const offerList = offers.map(offer => offer.productId)
            const enriched = products.map(p => {
                const offerItem = offers.find(offer => offer.productId === p.id);
                const stockCount = stock.items[p.id] || 0
                return {
                    ...p,
                    stock: stockCount,
                    off: offerItem ? offerItem.percent : undefined,
                    oldPrice: offerItem ?
                        Math.round(p.price / (1 - offerItem.percent / 100)) : undefined,
                }
            })

            const filteredProducts = enriched.filter(product => offerList.includes(product.id));
            const productsTrackLatest = document.querySelector('.products-track-latest');
            if (!productsTrackLatest) return;

            const cards = filteredProducts.map(makeCard);
            productsTrackLatest.textContent = '';
            cards.forEach((card) => productsTrackLatest.append(card));
            console.log(filteredProducts);
        })

    .catch((error) => {
        showError('اتصال اینترنت برقرار نیست.');

    })
}

export { getAndShowOfferProducts, getAndShowAllProducts };