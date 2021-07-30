const { assert, expect } = require('chai');

const { roundDecimal, msToS, fetchPsiResult, formatPsi } = require('../psi');
const { psiMock } = require('./psi.mock');

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
    const results = formatPsi(psiMock.lighthouseResult);
    it('LH result', function() {
        const s = msToS(2500);
        expect(results.lh).to.equal(91);
    });
});

// describe('Fetch PSI', function() {
//     it('Responds with a result', async function() {
//         this.timeout(30000);
//         const psi = await fetchPsiResult('https://www.adobe.com/express', process.env.PSI_KEY);
//         assert.typeOf(psi, 'object');
//     });
// });