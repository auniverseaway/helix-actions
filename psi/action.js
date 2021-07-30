const core = require('@actions/core');
const github = require('@actions/github');
const { getPsi } = require('./lib/psi');
const buildBody = require('./lib/buildBody');
const getColor = require('./lib/getColor');

async function run() {
  try {
    const token = core.getInput('repo-token');
    const psiKey = core.getInput('psi-key');
    const relativeUrl = core.getInput('relative-url');

    const fcpThreshold = core.getInput('fcp');
    const lcpThreshold = core.getInput('lcp');
    const tbtThreshold = core.getInput('tbt');
    const clsThreshold = core.getInput('cls');

    const { ref } = github.context.payload.pull_request.head;
    const { name } = github.context.payload.pull_request.head.repo;
    const { login } = github.context.payload.pull_request.user;
    // const url = `https://${ref}--${name}--${login}.hlx3.page${relativeUrl}`;
    const url = 'https://www.adobe.com/';

    const { lh, fcp, lcp, tbt, cls } = await getPsi(url, psiKey);
    
    const results = {
      lh: { label: 'LH', value: lh, color: getColor('lh', lh) },
      fcp: { label: 'FCP', value: fcp, color: getColor('fcp', fcp) },
      lcp: { label: 'LCP', value: lcp, color: getColor('lcp', lcp) },
      tbt: { label: 'TBT', value: tbt, color: getColor('tbt', tbt) },
      cls: { label: 'CLS', value: cls, color: getColor('cls', cls) },
    };

    const body = buildBody(url, results);

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