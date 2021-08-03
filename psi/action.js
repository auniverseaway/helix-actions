const core = require('@actions/core');
const github = require('@actions/github');
const { getPsi } = require('./lib/psi');
const buildBody = require('./lib/buildBody');
const getColor = require('./lib/getColor');

const COMMENT_HEADER = '# ![Helix](https://raw.githubusercontent.com/auniverseaway/helix-actions/main/helix-logo.svg) Helix Actions';

function formatResults({ lh, fcp, lcp, tbt, cls }) {
  return {
    lh: { label: 'LH', value: lh, color: getColor('lh', lh, true) },
    fcp: { label: 'FCP', value: fcp, color: getColor('fcp', fcp) },
    lcp: { label: 'LCP', value: lcp, color: getColor('lcp', lcp) },
    tbt: { label: 'TBT', value: tbt, color: getColor('tbt', tbt) },
    cls: { label: 'CLS', value: cls, color: getColor('cls', cls) },
  };
}

async function getPsiAttempt(url, psiKey, thresholds, attemptNo) {
  // Get the PSI response from the library
  const psi = await getPsi(url, psiKey);
  let attempt = {};

  console.log(psi.results);
  console.log(thresholds);

  // If there are results, compare and format them
  if (psi.results) {
    // See if thresholds have been met
    if (psi.results.lh > thresholds.lh ||
        psi.results.fcp < thresholds.fcp ||
        psi.results.lcp < thresholds.lcp ||
        psi.results.tbt < thresholds.tbt ||
        psi.results.cls < thresholds.cls) {
      attempt.threshold = true;
    }
    const formatted = formatResults(psi.results);
    attempt.body = buildBody(url, formatted, attemptNo);
  }
  // If there's a message, something died on the PSI side.
  if (psi.message) {
    attempt.body = psi.message;
  }
  // If there still isn't a body, something else went wrong.
  if (!attempt.body) {
    attempt.body = 'Something went wrong.';
  }
  console.log(attempt);
  return attempt;
}

async function run() {
  try {
    // Get basic inputs
    const token = core.getInput('repo-token');
    const psiKey = core.getInput('psi-key');
    const relativeUrl = core.getInput('relative-url');

    // Build URL
    const { ref } = github.context.payload.pull_request.head;
    const { name } = github.context.payload.pull_request.head.repo;
    const { login } = github.context.payload.pull_request.head.user;
    const url = 'https://www.adobe.com/';
    // const url = `https://${ref}--${name}--${login}.hlx3.page${relativeUrl}`;

    // Get thresholds of failure
    const thresholds = {
      lh: core.getInput('lh'),
      fcp: core.getInput('fcp'),
      lcp: core.getInput('lcp'),
      tbt: core.getInput('tbt'),
      cls: core.getInput('cls'),
    };

    // Setup attempts
    let attempts = [];

    // First PSI attempt
    attempts.push(await getPsiAttempt(url, psiKey, thresholds));

    console.log(attempts[0]);
    console.log(attempts[0].threshold);

    // Second PSI attempt
    if (!attempts[0].threshold) {
      attempts.push(await getPsiAttempt(url, psiKey, thresholds, 2));
    }

    let body = COMMENT_HEADER;
    attempts.forEach((attempt) => {
      body += attempt.body;
    });

    // Get octokit for commenting
    const octokit = new github.getOctokit(token);

    // Setup comment details
    const issue_number = github.context.payload.pull_request.number;
    const { owner, repo } = github.context.repo;
    const comment = octokit.rest.issues.createComment({ owner, repo, issue_number, body });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
