/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const { context, ALPN_HTTP1_1, createUrl } = require('@adobe/helix-fetch');
const { fetch } = context({ alpnProtocols: [ALPN_HTTP1_1] });

const PSI_URL = 'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';

function roundDecimal(value, amount) {
    return Math.round((value + Number.EPSILON) * amount) / amount;
};

function msToS(value) {
    return value / 1000.0;
}

function buildQuery(url, key) {
    const qs = { url, strategy: 'mobile' };
    if (key) { qs.key = key; }
    return qs;
};

async function fetchPsiResponse(url, key) {
    const qs = buildQuery(url, key);
    return await fetch(createUrl(PSI_URL, qs));
};

function formatPsi({ categories, audits }, code) {
    const lh = Math.round(categories.performance.score * 100);
    const fcp = roundDecimal(msToS(audits['first-contentful-paint'].numericValue), 100);
    const lcp = roundDecimal(msToS(audits['largest-contentful-paint'].numericValue), 100);
    const tbt = roundDecimal(msToS(audits['total-blocking-time'].numericValue), 100);
    const cls = roundDecimal(audits['cumulative-layout-shift'].numericValue, 1000);
    return ({code, results: { lh, fcp, lcp, tbt, cls }});
}

async function getPsi(url, key) {
    const resp = await fetchPsiResponse(url, key);
    const json = await resp.json();
    console.log(json);
    if (json.lighthouseResult) {
        return formatPsi(json.lighthouseResult, resp.status);
    }
    return json.error;
};

module.exports = {
    roundDecimal,
    msToS,
    buildQuery,
    getPsi,
    formatPsi,
};