# Homework 6 — Statistical Independence: Theory and Conclusions

## Independence in probability
For discrete categorical random variables X and F, independence means P(X=x,F=f)=P(X=x)P(F=f) for every pair of categories. If P(X=x)>0, equivalently P(F=f | X=x)=P(F=f). This is a property of a probability distribution, not merely of one finite sample.

## Independence in statistics
The null hypothesis H0 states that the population variables are independent. The alternative H1 states that they are associated. Sampling fluctuations can produce nonzero differences even when H0 is true. The chosen significance level alpha is the probability of rejecting H0 when H0 is true, under the model assumptions. A p-value is the probability, assuming H0, of a test statistic at least as extreme as the observed one; it is not the probability that H0 is true.

## Frequencies and chi-square
For cell (i,j), observed O_ij and expected E_ij = (row total_i * column total_j) / N. Pearson's chi-square statistic is sum (O_ij-E_ij)^2/E_ij, with (r-1)(c-1) degrees of freedom. The approximate p-value is the upper tail of the chi-square distribution. Cramer's V = sqrt(chi-square / (N * min(r-1,c-1))) and is between 0 and 1 for contingency tables.

## Interpretation and limitations
Reject H0 when p < alpha, otherwise do not reject H0. Failure to reject is not proof of independence. Chi-square's asymptotic approximation can be unreliable when expected cell counts are small; for sparse 2x2 tables Fisher's exact test is an alternative. The observations should be independent, and sampling design matters for population generalization. Association does not establish causation: confounding, reverse causation and selection effects can explain a relationship.

## Worked example
For observed counts [[40,10],[30,20]], the expected counts are [[35,15],[35,15]]. Chi-square = 4.761905, df = 1, p ≈ 0.029096, and Cramer's V ≈ 0.2182. At alpha 0.05 we reject H0, but at alpha 0.01 we do not. These are synthetic educational data, not causal evidence.

## Software architecture
`js/data/` stores example datasets and the CSV parser. `js/statistics/contingency.js` computes observed, joint, marginal and conditional frequencies. `js/statistics/chiSquare.js` computes expected counts, cell contributions, chi-square, gamma-tail p-values and Cramer's V. `js/charts/visualizations.js` builds comparison charts. `js/analysis/findings.js` constructs the final interpretation. `js/main.js` wires user interactions and renders the interface.

## Further development
Fisher's exact test, permutation tests, effect-size uncertainty intervals and support for stratified analyses would improve inference, especially for sparse or confounded data.
