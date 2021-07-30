const core = require('@actions/core');
const github = require('@actions/github');
const { getPsi } = require('./lib/psi');

function getBadge (label, value, color) {
    return `![${label}](https://img.shields.io/badge/${label}-${value}-${color}?style=flat-square)`;
};

async function run() {
  try {
    const token = core.getInput('repo-token');
    const psiKey = core.getInput('psi-key');
    const relativeUrl = core.getInput('relative-url');

    const { ref } = github.context.payload.pull_request.head;
    const { name } = github.context.payload.pull_request.head.repo;
    const { login } = github.context.payload.pull_request.user;
    const url = `https://${ref}--${name}--${login}.hlx3.page${relativeUrl}`;

    console.log(url);

    const { lh, fcp, lcp, tbt, cls } = await getPsi(url, psiKey);

    const lhColor = 'brightgreen';
    const fcpColor = 'brightgreen';
    const lcpColor = 'brightgreen';
    const tbtColor = 'brightgreen';
    const clsColor = 'brightgreen';

    const body = 
    `Test: [${url}](${url})
    ${getBadge('LH', lh, lhColor)} ${getBadge('FCP', fcp, fcpColor)} ${getBadge('LCP', lcp, lcpColor)} ${getBadge('TBT', tbt, tbtColor)} ${getBadge('CLS', cls, clsColor)}`;

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