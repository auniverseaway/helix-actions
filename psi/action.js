const core = require('@actions/core');
const github = require('@actions/github');
const { getPsi } = require('./lib/psi');
const buildBody = require('./lib/buildBody');
const getColor = require('./lib/getColor');

function getResults(lh, fcp, lcp, tbt, cls) {
  return {
    lh: { label: 'LH', value: lh, color: getColor('lh', lh, true) },
    fcp: { label: 'FCP', value: fcp, color: getColor('fcp', fcp) },
    lcp: { label: 'LCP', value: lcp, color: getColor('lcp', lcp) },
    tbt: { label: 'TBT', value: tbt, color: getColor('tbt', tbt) },
    cls: { label: 'CLS', value: cls, color: getColor('cls', cls) },
  };
}

async function getSecondAttempt(url, psiKey) {
  const { lh, fcp, lcp, tbt, cls } = await getPsi(url, psiKey);
  return getResults(lh, fcp, lcp, tbt, cls);
}

async function run() {
  try {
    const token = core.getInput('repo-token');
    const psiKey = core.getInput('psi-key');
    const relativeUrl = core.getInput('relative-url');

    console.log(psiKey);

    const lhThreshold = core.getInput('lh');
    const fcpThreshold = core.getInput('fcp');
    const lcpThreshold = core.getInput('lcp');
    const tbtThreshold = core.getInput('tbt');
    const clsThreshold = core.getInput('cls');

    const { ref } = github.context.payload.pull_request.head;
    const { name } = github.context.payload.pull_request.head.repo;
    const { login } = github.context.payload.pull_request.user;
    const url = `https://${ref}--${name}--${login}.hlx3.page${relativeUrl}`;

    const { lh, fcp, lcp, tbt, cls } = await getPsi(url, psiKey);
    const results = getResults(lh, fcp, lcp, tbt, cls);

    let secondResults;
    if (lh < lhThreshold ||
        fcp > fcpThreshold ||
        lcp > lcpThreshold ||
        tbt > tbtThreshold ||
        cls > clsThreshold ) {
        secondResults = await getSecondAttempt(url, psiKey);
    }

    let body = '# ![Helix](https://raw.githubusercontent.com/auniverseaway/helix-actions/main/helix-logo.svg) Helix Actions';
    body += buildBody(url, results, 1);
    if (secondResults) {
      body += buildBody(url, secondResults, 2);
    }

    const issue_number = github.context.payload.pull_request.number;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    const octokit = new github.getOctokit(token);
    const comment = octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();