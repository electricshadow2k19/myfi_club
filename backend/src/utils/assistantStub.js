/**
 * Keyword fallback when RAG retrieval score is too low and no LLM key is set.
 */
function buildStubReply(userMessage) {
  const lower = userMessage.toLowerCase();
  let reply =
    'Here is general guidance (no strong match to a specific knowledge article—try adding words like **minimum**, **credit card**, **APR**, or **EMI**):\n\n';
  if (/debt|pay off|balance|interest|credit card|minimum|lakh|bill|card/i.test(userMessage)) {
    reply +=
      'For credit card debt: paying only the **minimum** keeps the account current but **interest keeps accruing**. **Payoff time** depends on your **APR** and minimum rules—use your statement or a calculator with your real numbers. Paying more than the minimum saves interest. Common strategies: **avalanche** (highest APR first) or **snowball** (smallest balance first).';
  } else if (/credit score|utilization|crif|experian|cibil/i.test(lower)) {
    reply +=
      'Credit scores usually benefit from **on-time payments** and **lower utilization**. Check your bureau report for factors and dispute errors if needed.';
  } else if (/save|savings|sip|invest|mutual|gold/i.test(lower)) {
    reply +=
      'For savings and investing, align amount and horizon with your goals; read scheme documents and remember market-linked products carry risk.';
  } else {
    reply +=
      'You can ask about **UPI**, **SIP**, **gold**, **insurance**, **home loans**, **BNPL**, **budgeting**, and more.';
  }
  return reply;
}

module.exports = { buildStubReply };
