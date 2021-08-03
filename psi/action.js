const core = require('@actions/core');
const github = require('@actions/github');
const { getPsiAttempt } = require('./lib/psi');

const COMMENT_HEADER = '# ![Helix](https://raw.githubusercontent.com/auniverseaway/helix-actions/main/helix-logo.svg) Helix Actions';

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
    // const url = 'https://www.adobe.com/';
    const url = `https://${ref}--${name}--${login}.hlx3.page${relativeUrl}`;

    // Get thresholds of failure
    const thresholds = {
      lh: parseFloat(core.getInput('lh')),
      fcp: parseFloat(core.getInput('fcp')),
      lcp: parseFloat(core.getInput('lcp')),
      tbt: parseFloat(core.getInput('tbt')),
      cls: parseFloat(core.getInput('cls')),
    };

    // Setup attempts
    let attempts = [];

    // First PSI attempt
    const psi = await getPsi(url, psiKey);
    attempts.push(await getPsiAttempt(psi, url, thresholds));

    // Second PSI attempt
    if (!attempts[0].threshold) {
      const psiTwo = await getPsi(url, psiKey);
      attempts.push(await getPsiAttempt(psiTwo, url, thresholds, 2));
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
