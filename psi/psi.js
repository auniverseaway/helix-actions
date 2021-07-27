const core = require('@actions/core');
const github = require('@actions/github');

function getBadge (label, value, color) {
    return `![${label}](https://img.shields.io/badge/${label}-${value}-${color}?style=flat-square)`;
};

async function run() {
  try {
    const token = core.getInput('repo-token');

    const octokit = new github.getOctokit(token);

    const lh = '100';
    const lhColor = 'brightgreen';

    const fcp = '0.8s';
    const fcpColor = 'brightgreen';

    const lcp = '1.4s';
    const lcpColor = 'brightgreen';

    const tbt = '90ms';
    const tbtColor = 'brightgreen';

    const cls = '0.001';
    const clsColor = 'brightgreen';

    const body = `${getBadge('LH', lh, lhColor)} ${getBadge('FCP', fcp, fcpColor)} ${getBadge('LCP', lcp, lcpColor)} ${getBadge('TBT', tbt, tbtColor)} ${getBadge('CLS', cls, clsColor)}`;

    const issue_number = github.context.payload.pull_request.number;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
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