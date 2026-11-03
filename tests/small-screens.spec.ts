import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

/**
 * Plays through the whole game on small phone screens and checks that nothing gets cut off:
 *  - nothing sticks out of the screen sideways (the page must not need horizontal scrolling),
 *  - no button label wraps onto a second line or overflows its button,
 *  - the "1/5" round screen fits above its arrow button,
 *  - the product detail can always be closed with its X button.
 *
 * The live game loads its texts and numbers from a Google Sheet. The tests serve
 * tests/fixtures/game-data.json instead (same structure, Czech texts of similar length),
 * so they run offline and always see the same data.
 */

const gameData: unknown[] = JSON.parse(readFileSync(new URL('./fixtures/game-data.json', import.meta.url), 'utf8'));
const sheetTsv = gameData.map(part => JSON.stringify(part)).join('\n');

// Indexes into the scenarios in the fixture (also the ?gameMode= URL parameter).
const CAMPAIGN = 0;
const SOLO = 1;
const SOLO_10_ROUNDS = 2;

const phones = [
    { name: 'iPhone SE 1st gen', width: 320, height: 568 },
    { name: 'phone from the bug report', width: 347, height: 700 },
    { name: 'small Android', width: 360, height: 640 },
    { name: 'iPhone SE with Safari bars', width: 375, height: 548 },
];

const products = ['Akcie', 'Krypto', 'Podílový fond', 'Nemovitosti', 'Zlato', 'Podnikání'];
const arrowButton = 'button:has(rect[rx="19.5"])';
const productCloseButton = 'button:has(circle[cx="15.3345"])';

/** Runs in the browser; returns a human readable description of every layout problem on the current screen. */
function findLayoutProblems(): string[] {
    const problems: string[] = [];
    const root = document.getElementById('root')!;
    const viewportWidth = document.documentElement.clientWidth;
    const describe = (el: Element) =>
        `<${el.tagName.toLowerCase()} class="${el.getAttribute('class') ?? ''}"> "${(el.textContent ?? '').trim().slice(0, 30)}"`;
    const sticksOut = (rect: DOMRect) => rect.left < -1 || rect.right > viewportWidth + 1;
    const clippedByAncestor = (el: Element) => {
        for (let a = el.parentElement; a && a !== root; a = a.parentElement) {
            if (getComputedStyle(a).overflowX !== 'visible') return true;
        }
        return false;
    };

    if (document.documentElement.scrollWidth > viewportWidth) {
        problems.push(`page scrolls sideways (${document.documentElement.scrollWidth}px wide on a ${viewportWidth}px screen)`);
    }

    for (const el of root.querySelectorAll('*')) {
        if (el.tagName.toLowerCase() !== 'svg' && el.closest('svg')) continue;
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height || !sticksOut(rect) || clippedByAncestor(el)) continue;
        // report only the outermost element that sticks out
        if (el.parentElement !== root && sticksOut(el.parentElement!.getBoundingClientRect())) continue;
        problems.push(`${describe(el)} sticks out of the screen (x ${Math.round(rect.left)}..${Math.round(rect.right)})`);
    }

    for (const button of root.querySelectorAll('button')) {
        if (!button.getBoundingClientRect().width) continue;
        if (button.scrollWidth > button.clientWidth + 1) {
            problems.push(`label of ${describe(button)} does not fit into the button`);
        }
        const texts = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
        for (let node = texts.nextNode(); node; node = texts.nextNode()) {
            const range = document.createRange();
            range.selectNodeContents(node);
            const lines = new Set([...range.getClientRects()].filter(r => r.width > 1).map(r => Math.round(r.top)));
            if (lines.size > 1) problems.push(`label of ${describe(button)} wraps onto ${lines.size} lines`);
        }
    }
    return problems;
}

async function expectScreenFits(page: Page, screen: string) {
    expect.soft(await page.evaluate(findLayoutProblems), `layout problems on the "${screen}" screen`).toEqual([]);
}

async function expectRoundScreenFits(page: Page) {
    const viewport = page.viewportSize()!;
    const topFaces = await page.locator('svg[viewBox="0 0 284 150"]').boundingBox();
    const bottomFaces = await page.locator('svg[viewBox="0 0 294 197"]').boundingBox();
    const button = await page.locator(arrowButton).boundingBox();
    expect.soft(topFaces!.y, 'faces above the round number are cut off at the top').toBeGreaterThanOrEqual(0);
    expect.soft(bottomFaces!.y + bottomFaces!.height, 'faces below the round number overlap the arrow button')
        .toBeLessThanOrEqual(button!.y);
    expect.soft(button!.y + button!.height, 'arrow button is off screen').toBeLessThanOrEqual(viewport.height);
}

async function currentScreen(page: Page): Promise<string> {
    const visible = (selector: string) => page.locator(selector).first().isVisible();
    if (await visible('text=Tvoje výnosy za')) return 'earnings';
    if (await visible('text=Moje portfolio')) return 'portfolio';
    if (await visible('img[src="cover.svg"]')) return 'landing';
    if (await visible('button:has-text("Začít hru")')) return 'solo instructions';
    if (await visible('h1:text-matches("^\\\\d+/\\\\d+$")')) return 'new round';
    if (await visible('text=Krize! Hází se kostkou')) return 'bankruptcy dice';
    if (await visible('button:has-text("Hodit kostkou")')) return 'bankruptcy news';
    if (await visible('text=ZPRÁVY')) return 'news';
    if (await visible('img[src="end_screen_picture.svg"]')) return 'play again';
    if (await visible('text=RIZIKOVOST')) return 'risk result';
    if (await visible('text=Hotovost')) return 'score';
    if (await visible('img[src="news-help.svg"]')) return 'news tutorial';
    if (await visible('text=Hoď si kostkou')) return 'earnings tutorial';
    if (await visible('img[src="start-portfolio-help.svg"]')) return 'portfolio tutorial';
    if (await visible('img[src="makemoney.svg"]')) return 'campaign event';
    if (await visible('img[src="goal-campaign.svg"]')) return 'campaign instructions';
    return 'unknown';
}

/** Opens a product, buys two pieces and closes it again with the X button (which must not be hidden). */
async function buyProduct(page: Page, product: string) {
    await page.locator(`h2:text-is("${product}")`).first().click();
    await expectScreenFits(page, `product detail ${product}`);
    await page.locator('button:text-is("Koupit")').click();
    await page.locator('button:text-is("Koupit")').click();
    await page.locator(productCloseButton).click({ timeout: 5_000 });
}

async function checkHelp(page: Page) {
    await page.locator('button:has(circle[cx="15.8669"])').first().click();
    const tabs = page.locator('button.w-1\\/4');
    for (let tab = 0; tab < await tabs.count(); tab++) {
        await tabs.nth(tab).click();
        await expectScreenFits(page, `help tab ${tab + 1}`);
    }
    await page.locator('button:has(path[d^="M3.86035"])').click();
}

async function playWholeGame(page: Page, gameMode: number) {
    // The game picks random news/dice; make it repeatable.
    await page.addInitScript(() => {
        let seed = 7;
        Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    });
    // Run offline: block everything external, serve the game data from the fixture.
    await page.route(/^https?:\/\/(?!localhost)/, route => route.abort());
    await page.route(/docs\.google\.com\/spreadsheets/, route =>
        route.fulfill({ status: 200, contentType: 'text/tab-separated-values', body: sheetTsv }));
    await page.goto(`/?gameMode=${gameMode}`);

    const seen = new Set<string>();
    for (let step = 0; step < 100; step++) {
        await page.waitForTimeout(250);
        const screen = await currentScreen(page);
        expect(screen, 'reached a screen the test does not know').not.toBe('unknown');
        await expectScreenFits(page, screen);
        const firstTime = !seen.has(screen);
        seen.add(screen);

        switch (screen) {
            case 'landing': await page.locator('button:has-text("HRÁT")').click(); break;
            case 'solo instructions': await page.locator('button:has-text("Začít hru")').click(); break;
            case 'new round':
                await expectRoundScreenFits(page);
                await page.locator(arrowButton).click();
                break;
            case 'news': case 'news tutorial': case 'earnings tutorial': case 'portfolio tutorial':
            case 'campaign event': case 'campaign instructions':
                await page.locator(arrowButton).click();
                break;
            case 'bankruptcy news': case 'bankruptcy dice':
                await page.locator('button:has-text("Hodit kostkou")').click();
                break;
            case 'earnings':
                await page.waitForTimeout(1_500); // incomes pop in one by one
                await expectScreenFits(page, 'earnings (all incomes shown)');
                await page.locator('button:has-text("Obchod")').click();
                break;
            case 'portfolio':
                if (firstTime) {
                    // Fill the portfolio so later screens show every product.
                    for (const product of products) await buyProduct(page, product);
                    await expectScreenFits(page, 'portfolio with every product');
                    await checkHelp(page);
                }
                await page.locator('button:has-text("Ukončit kolo")').click();
                break;
            case 'score': await page.locator('button:has(path[d^="M1.86694"])').click(); break;
            case 'risk result':
                if (gameMode !== CAMPAIGN) return seen;
                await page.locator('button:has-text("KONEC")').click();
                break;
            case 'play again': return seen;
        }
    }
    throw new Error('the game did not finish');
}

for (const phone of phones) {
    test.describe(`${phone.name} (${phone.width}×${phone.height})`, () => {
        test.use({ viewport: { width: phone.width, height: phone.height } });

        test('solo game fits the screen', async ({ page }) => {
            const seen = await playWholeGame(page, SOLO);
            expect(seen).toContain('risk result');
        });

        test('campaign fits the screen', async ({ page }) => {
            const seen = await playWholeGame(page, CAMPAIGN);
            expect(seen).toContain('play again');
        });
    });
}

test.describe('10 round game on the narrowest phone', () => {
    test.use({ viewport: { width: 320, height: 568 } });

    test('"10/10" round number fits', async ({ page }) => {
        const seen = await playWholeGame(page, SOLO_10_ROUNDS);
        expect(seen).toContain('risk result');
    });
});
