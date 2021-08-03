const { assert, expect } = require('chai');

const { roundDecimal, msToS, buildQuery, getPsi, formatPsi } = require('../psi');
const { psiMock } = require('./psi.mock');

const GOOD_URL = 'https://www.adobe.com/express';
const BAD_URL = 'https://main--not-live--adobe.hlx3.page';

describe('Rounding decimals', function() {
    it('Should round up to three points', function() {
        const cls = roundDecimal(0.0817271912, 1000);
        expect(cls).to.equal(0.082);
    });
    it('Should round down to three points', function() {
        const cls = roundDecimal(0.0813271912, 1000);
        expect(cls).to.equal(0.081);
    });

    it('Should round up to two points', function() {
        const cls = roundDecimal(0.081, 100);
        expect(cls).to.equal(0.08);
    });
    it('Should round down to two points', function() {
        const cls = roundDecimal(0.086, 100);
        expect(cls).to.equal(0.09);
    });
});

describe('MS to S', function() {
    it('Should convert', function() {
        const s = msToS(2500);
        expect(s).to.equal(2.5);
    });
});

describe('Format Results', function() {
    const psi = formatPsi(psiMock.lighthouseResult);
    it('LH result', function() {
        const s = msToS(2500);
        expect(psi.results.lh).to.equal(91);
    });
});

describe('Query Builder', function() {
    const psi = formatPsi(psiMock.lighthouseResult);
    it('Should not add key', function() {
        const qs = buildQuery(GOOD_URL);
        expect(qs.key).to.be.undefined;
    });
});

describe('Fetch PSI', function() {
    it('Responds with a result', async function() {
        this.timeout(30000);
        const psi = await getPsi(GOOD_URL, process.env.PSI_KEY);
        expect(psi.code).to.equal(200);
    });

    it('Handles a bad URL', async function() {
        this.timeout(30000);
        const psi = await getPsi(BAD_URL, process.env.PSI_KEY);
        expect(psi.code).to.equal(500);
        expect(psi.message).to.contain('Lighthouse returned error:');
    });
});