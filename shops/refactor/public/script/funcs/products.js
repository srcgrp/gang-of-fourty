import { BASEURL } from '../config.js';
import { showError, renderSkeletons } from '../components/skeleton.js';
import { makeCard } from '../components/productcard.js';


const toFa = (n) =>
    String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹' [d]);


const getAndShowOfferProducts = async() => {
    const track = document.querySelector('.products-track-off');
    if (!track) return;
    renderSkeletons(track);

    try {
        const products = await fetch(`${BASEURL}/products.json`);
        const stocks = await fetch(`${BASEURL}/stock.json`);
        const offers = await fetch(`${BASEURL}/offers.json`);


        if (!products.ok || !stocks.ok || !offers.ok) {
            showError(track, 'خطا در دریافت محصولات. لطفاً دوباره تلاش کنید.');
            return;
        }

        const product = await products.json();
        const stock = await stocks.json();
        const offer = await offers.json();


        const finalProduct = product.map((p) => {
            const offerItem = offer.find((o) => o.productId == p.id)
            const stokeItem = stock.items[p.id] || 0
            return {
                ...p,
                off: offerItem ? offerItem.percent : undefined,
                stock: stokeItem,
                oldPrice: offerItem ?
                    Math.round(p.price / (1 - offerItem.percent / 100)) : undefined

            }
        })

        const filtered = finalProduct.filter((p) => p.categoryId === 2);
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
    const productsTrackLatest = document.querySelector('.products-track-latest');
    renderSkeletons(productsTrackLatest);
    if (!productsTrackLatest) return;

    Promise.all([
            fetch(`${BASEURL}/products.json`),
            fetch(`${BASEURL}/stock.json`),
            fetch(`${BASEURL}/offers.json`),
        ])
        .then(responses => {
            responses.forEach(response => {
                if (!response.ok) {
                    showError(productsTrackLatest, 'خطا در دریافت محصولات. لطفاً دوباره تلاش کنید.');
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
            const cards = filteredProducts.map(makeCard);
            productsTrackLatest.textContent = '';
            cards.forEach((card) => productsTrackLatest.append(card));
        })

    .catch((error) => {
        showError(productsTrackLatest, 'اتصال اینترنت برقرار نیست.');

    })
}

export { getAndShowOfferProducts, getAndShowAllProducts };