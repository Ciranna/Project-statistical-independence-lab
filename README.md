# Homework 6 — Statistical Independence Lab

Phase 4: contingency tables, joint/marginal/conditional frequencies, expected frequencies under independence, Pearson chi-square statistic, degrees of freedom, p-value, Cramér's V, and interpretation.

## Run locally

```bash
npm install
npm test
npm run build
npm run dev
```

The app is a client-side Vite project. Its example datasets are synthetic and must not be interpreted as causal evidence.

## Mathematical method

For a table with observed counts O_ij, total N, row totals R_i, and column totals C_j, the expected count under independence is E_ij = R_i C_j / N. Pearson's statistic is sum((O_ij - E_ij)^2 / E_ij), with (r-1)(c-1) degrees of freedom. The p-value is the upper-tail probability of the chi-square distribution, evaluated using the regularized incomplete gamma function. Cramér's V is sqrt(chi-square / (N * min(r-1,c-1))).

Interpretation depends on assumptions: independent observations, adequate expected counts, and sampling design. A non-significant test does not prove independence. A significant association does not establish causation. For sparse tables, consider exact or Monte Carlo methods.

## Next phase

GitHub Pages deployment and oral-exam preparation. See `docs/CONCLUSIONS_AND_THEORY_EN.md` for theory and conclusions.

## Phase 3 — Custom CSV and charts
Upload a CSV with exactly two columns, a header, and one observation per subsequent row. The app computes observed/expected frequencies, chi-square statistics, p-values and Cramér's V, plus three comparative bar charts. The data are processed locally in the browser.

Example:
```csv
StudyMethod,Outcome
Individual,Pass
Individual,Fail
Group,Pass
Group,Fail
```

For meaningful inference, observations should be independent and sampled appropriately. The chi-square p-value is asymptotic and may be unreliable for sparse tables.

## Phase 4 — Conclusions & Findings
The dashboard now renders all three charts and a dynamic conclusions panel. It responds to the selected dataset and significance level, distinguishes statistical from probabilistic independence, and explicitly discusses causality and sparse-count limitations.
