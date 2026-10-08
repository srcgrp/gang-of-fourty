import { BASEURL } from '../config.js';


const toFa = (n) =>
    String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹' [d]);

const formatPrice = (n) => toFa(n.toLocaleString('en-US'));

const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
};

const makeIcon = (id, cls = 'icon') => {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', cls);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const use = document.createElementNS(NS, 'use');
    use.setAttribute('href', `#${id}`);
    svg.append(use);
    return svg;
};


const makeSkeleton = () => {
    const li = el('li', 'card skeleton');
    const top = el('div', 'card-top');
    const media = el('div', 'sk-media');
    const body = el('div', 'card-body');
    const line1 = el('div', 'sk-line');
    const line2 = el('div', 'sk-line sk-line--short');
    body.append(line1, line2);
    li.append(top, media, body);
    return li;
};


const showError = (track, msg) => {
    track.textContent = '';
    track.appendChild(el('li', 'error-msg', msg));
};


const makeButton = (className, label, iconId, text) => {
    const btn = el('button', className);
    btn.type = 'button';
    btn.setAttribute('aria-label', label);
    btn.append(makeIcon(iconId));
    if (text) btn.append(el('span', null, text));
    return btn;
};

const makeCard = (p) => {
    const card = el('li', 'card');
    const top = el('div', 'card-top');

    if (p.off) {
        const chipOff = el('span', 'chip-off');
        const srOff = el('span', 'sr-only', 'تخفیف ');
        chipOff.append(srOff, `${toFa(p.off)}٪`);
        top.append(chipOff);
    }

    if (p.rate) {
        const chipRate = el('span', 'chip-rate');
        chipRate.setAttribute('role', 'img');
        chipRate.setAttribute('aria-label', `امتیاز ${toFa(p.rate)} از ۵`);
        chipRate.append(makeIcon('i-star', 'icon icon--fill'), toFa(p.rate));
        top.append(chipRate);
    }

    const media = el('a', 'card-media');
    media.href = '#products';
    media.tabIndex = -1;
    media.setAttribute('aria-hidden', 'true');

    const emoji = el('span', 'card-emoji', p.emoji);
    emoji.setAttribute('role', 'img');
    emoji.setAttribute('aria-label', `تصویر ${p.name}`);
    media.append(emoji);


    const title = el('h3', 'card-title');
    const titleLink = el('a', null, p.name);
    titleLink.href = '#products';
    title.append(titleLink);

    const body = el('div', 'card-body');
    body.append(title);

    const price = el('p', 'price');
    const strong = el('strong', null, formatPrice(p.price));
    strong.append(el('small', null, 'تومان'));
    price.append(strong);

    if (p.oldPrice) {
        const del = el('del');
        del.append(
            el('span', 'sr-only', 'قیمت قبل از تخفیف '),
            formatPrice(p.oldPrice)
        );
        price.append(del);
    }

    const pair = el('div', 'act-pair');
    pair.append(
        makeButton('act-btn', `افزودن ${p.name} به علاقه‌مندی‌ها`, 'i-heart'),
        makeButton('act-btn act-cart', `افزودن ${p.name} به سبد خرید`, 'i-cart', 'افزودن')
    );

    const actions = el('div', 'card-actions');
    actions.append(price, pair);

    card.append(top, media, body, actions);
    return card;
};


const getAndShowProducts = async() => {
    const track = document.querySelector('.products-track-off');
    if (!track) return;

    const renderSkeletons = (container, count = 5) =>
        container.replaceChildren(
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