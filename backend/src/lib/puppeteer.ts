import puppeteer from 'puppeteer';

let browser: any = null;

export const getBrowser = async () => {
    if (!browser) {
        browser = await puppeteer.launch();
    }
    return browser;
};
