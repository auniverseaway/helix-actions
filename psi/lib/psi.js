const { context, ALPN_HTTP1_1, createUrl } = require('@adobe/helix-fetch');
const { fetch } = context({ alpnProtocols: [ALPN_HTTP1_1] });

const PSI_URL = 'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';

function roundCls(value) {
    return Math.round((value + Number.EPSILON) * 1000) / 1000;
};

function msToS(value) {
    return value / 1000.0;
}

async function fetchPsiResult(url, key) {
    const qs = { url, key };
    const resp = await fetch(createUrl(PSI_URL, qs));
    const json = await resp.json();
    return json.lighthouseResult;
};

function formatPsi({ categories, audits }) {
    const lh = Math.round(categories.performance.score * 100);
    const fcp = msToS(audits['first-contentful-paint'].numericValue);
    const lcp = msToS(audits['largest-contentful-paint'].numericValue);
    const tbt = msToS(audits['total-blocking-time'].numericValue);
    const cls = roundCls(audits['cumulative-layout-shift'].numericValue);
    return ({ lh, fcp, lcp, tbt, cls });
}

async function getPsi(url, key) {
    const result = await fetchPsiResult(url, key);
    const formatted = formatPsi(result);
    return formatted;
};

module.exports = {
    roundCls,
    msToS,
    getPsi,
    fetchPsiResult,
    formatPsi,
};