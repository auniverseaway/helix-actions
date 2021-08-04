# helix-actions are awesome.
Github Actions for Helix websites.

## Helix PSI
The Helix PSI Action is designed to look at an incoming PR, audit it against the Page Speed Insights API, and report the results.

### Installation
You will need to add `PSI_KEY` to your project secrets. You can get your own PSI API key [here](https://developers.google.com/speed/docs/insights/v5/get-started#APIKey).

Once added, you need to add a workflow file to `.github/workflows/your-workflow-name.yml`. Use the sample workflow config below.

**Note:** If you send a PR with the workflow, it will try to run, but it will not have access to your secret key. This is by design from github to prevent leaking of secrets.

#### Sample Workflow

```yml
name: Run Helix PSI Audit

on:
  pull_request:
    types: [opened, synchronize, reopened, edited]
    branches:
      - main

jobs:
  action:
    runs-on: ubuntu-latest

    steps:
      - name: Use repo PSI action
        uses: auniverseaway/helix-actions/psi@main
        with:
          psi-key: ${{ secrets.PSI_KEY }}

```

### Testing
The tests do hit the Page Speed Insights API. To run them locally:

```bash
PSI_KEY='{{YOUR_PSI_API_KEY}}' npm run test
```
