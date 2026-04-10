/**
 * Keyword stub when RAG retrieval finds no strong match and no LLM key is set.
 */
function buildStubReply(userMessage) {
  const lower = userMessage.toLowerCase();
  let reply =
    "Thanks for using MYFI Assistant (preview). I'm not connected to live financial data or a full RAG pipeline yet—this is a stub response for integration testing.\n\n";
  if (/debt|pay off|balance|interest/i.test(userMessage)) {
    reply +=
      'For credit card debt in general: prioritize high-APR balances, pay at least the minimum on all cards, and consider the avalanche (highest rate first) or snowball (smallest balance first) strategy. Verify numbers against your actual statements in the MYFI app.';
  } else if (/credit score|utilization|crif|experian/i.test(lower)) {
    reply +=
      "Credit scores often improve when utilization stays low and payments are on time. Check your latest score and factors inside MYFI's credit section once live data is linked.";
  } else if (/save|savings|sip|invest/i.test(lower)) {
    reply +=
      'For savings and investing, align amount and horizon with your goals. MYFI will surface personalized insights once your accounts and risk profile are connected.';
  } else {
    reply +=
      "Ask me about debt payoff, credit utilization, or savings goals—I'll respond with educational guidance grounded in MYFI policies once RAG is enabled.";
  }
  return reply;
}

module.exports = { buildStubReply };
