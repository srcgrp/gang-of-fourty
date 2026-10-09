import { el, makeIcon, makeButton } from '../utils/dom.js';
import { formatPrice } from '../utils/format.js';

const makeCard = (p) => {
    const card = el('li', 'card');
    const top = el('div', 'card-top');

    if (p.off) {
        const chipOff = el('span', 'chip-off');
        const srOff = el('span', 'sr-only', 'تخفیف ');
        chipOff.append(srOff, `${formatPrice(p.off)}٪`);
        top.append(chipOff);
    }

    if (p.rate) {
        const chipRate = el('span', 'chip-rate');
        chipRate.setAttribute('role', 'img');
        chipRate.setAttribute('aria-label', `امتیاز ${formatPrice(p.rate)} از ۵`);
        chipRate.append(makeIcon('i-star', 'icon icon--fill'), formatPrice(p.rate));
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


export { makeCard }