const { assert, expect } = require('chai');

const { roundCls, msToS, fetchPsiResult, formatPsi } = require('../psi');
const { psiMock } = require('./psi.mock');

describe('CLS', function() {
    it('Should round up', function() {
        const cls = roundCls(0.0817271912);
        expect(cls).to.equal(0.082);
    });
    it('Should round down', function() {
        const cls = roundCls(0.0813271912);
        expect(cls).to.equal(0.081);
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