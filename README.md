# helix-actions
Github Actions for Helix websites.


## Helix PSI
The Helix PSI Action is designed to look at an incoming PR, audit it against the Page Speed Insights API, and report the results.

### Sample Workflow

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

```

### Testing
The tests do hit the Page Speed Insights API. To run them locally:

```bash
PSI_KEY='{{YOUR_PSI_API_KEY}}' npm run test
```

You can get your own API key [here](https://developers.google.com/speed/docs/insights/v5/get-started).
