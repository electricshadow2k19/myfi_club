/**
 * Keyword fallback when RAG score is too low (no LLM or weak retrieval).
 */
function buildStubReply(userMessage) {
  const lower = userMessage.toLowerCase();
  let reply =
    'I focus on **personal finance for India**. I could not match a strong knowledge-base article — try words like **credit card**, **minimum payment**, **SIP**, **CIBIL**, or **UPI**.\n\n';
  if (/debt|pay off|balance|interest|credit card|minimum|lakh|bill|card/i.test(userMessage)) {
    reply +=
      'On **card debt**: paying only the **minimum** avoids late fees but **interest keeps building** on the rest. Payoff time needs your real **APR** and rules — use your **statement** or a calculator. Paying extra, especially early, saves the most interest.';
  } else if (/credit score|utilization|cibil|crif|experian/i.test(lower)) {
    reply +=
      'Scores usually reward **on-time payments** and **lower credit utilization**. Pull your bureau report for factors and dispute errors if needed.';
  } else if (/save|sip|invest|mutual|gold|insurance/i.test(lower)) {
    reply +=
      'For investing and savings: match products to your **horizon** and **risk**; read scheme documents — market-linked options are not guaranteed.';
  } else {
    reply += 'Ask about **UPI**, **SIP**, **gold**, **insurance**, **home loans**, **BNPL**, or **budgeting**.';
  }
  return reply;
}

module.exports = { buildStubReply };
