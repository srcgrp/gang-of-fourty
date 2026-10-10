import { BASEURL } from '../config.js';
import { showError, renderSkeletons } from '../components/skeleton.js';
import { makeCard } from '../components/productcard.js';


const toFa = (n) =>
    String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹' [d]);


const getProductsWithDetails = async() => {
    const responses = await Promise.all([
        fetch(`${BASEURL}/products.json`).then(r => r.json()),
        fetch(`${BASEURL}/stock.json`).then(r => r.json()),
        fetch(`${BASEURL}/offers.json`).then(r => r.json()),
    ])

    if (responses.some(r => !r.ok)) {
        throw new Error('fetch failed')
    }

    const [products, stocks, offers] = await Promise.all(
        responses.map(r => r.json())
    )

    const finalProduct = products.map((p) => {
        const offerItem = offers.find((o) => o.productId == p.id)
        const stokeItem = stocks.items[p.id] || 0
        return {
            ...p,
            off: offerItem ? offerItem.percent : undefined,
            stock: stokeItem,
            oldPrice: offerItem ?
                Math.round(p.price / (1 - offerItem.percent / 100)) : undefined

        }
    })
    return finalProduct
}


const getAndShowOfferProducts = async() => {
    const track = document.querySelector('.products-track-off');
    if (!track) return;

    renderSkeletons(track);

    try {

        const products = await getProductsWithDetails()
        const filtered = products.filter((p) => p.categoryId === 2);
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
}

const getAndShowAllProducts = () => {
    const productsTrackLatest = document.querySelector('.products-track-latest');
    if (!productsTrackLatest) return;
    renderSkeletons(productsTrackLatest);

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