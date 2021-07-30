# helix-actions
Github Actions for Helix websites.

## Helix PSI
The Helix PSI Action is designed to look at an incoming PR, audit it against the Page Speed Insights API, and report the results.

### Testing
The tests do hit the Page Speed Insights API. To run them locally:

```bash
PSI_KEY='{{YOUR_PSI_API_KEY}}' npm run test
```

You can get your own API key [here](https://developers.google.com/speed/docs/insights/v5/get-started).
