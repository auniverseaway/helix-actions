const { context, ALPN_HTTP1_1, createUrl } = require('@adobe/helix-fetch');
const { fetch } = context({ alpnProtocols: [ALPN_HTTP1_1] });

const PSI_URL = 'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';

function roundDecimal(value, amount) {
    return Math.round((value + Number.EPSILON) * amount) / amount;
};

function msToS(value) {
    return value / 1000.0;
}

async function fetchPsiResult(url, key) {
    const qs = { url, key: 'AIzaSyBxPnPkkIal_riyIjD9cI4IO-512pabiMM', strategy: 'mobile' };
    console.log(qs);
    const resp = await fetch(createUrl(PSI_URL, qs));
    console.log(resp);
    const json = await resp.json();
    console.log(json);
    return json.lighthouseResult;
};

function formatPsi({ categories, audits }) {
    const lh = Math.round(categories.performance.score * 100);
    const fcp = roundDecimal(msToS(audits['first-contentful-paint'].numericValue), 100);
    const lcp = roundDecimal(msToS(audits['largest-contentful-paint'].numericValue), 100);
    const tbt = roundDecimal(msToS(audits['total-blocking-time'].numericValue), 100);
    const cls = roundDecimal(audits['cumulative-layout-shift'].numericValue, 1000);
    return ({ lh, fcp, lcp, tbt, cls });
}

async function getPsi(url, key) {
    const result = await fetchPsiResult(url, key);
    const formatted = formatPsi(result);
    return formatted;
};

module.exports = {
    roundDecimal,
    msToS,
    getPsi,
    fetchPsiResult,
    formatPsi,
};