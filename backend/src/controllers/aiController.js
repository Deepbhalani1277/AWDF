import OpenAI from 'openai';

// Rate Limiting in-memory tracking (Cooldown: 4 seconds per client IP)
const rateLimitMap = new Map();
const COOLDOWN_MS = 4000;

/**
 * Intelligent Fallback Generator
 * Provides structured contextual descriptions when external AI is unavailable or fails.
 */
const generateContextualFallback = (title) => {
  const lower = title.toLowerCase();
  let category = 'development task';
  let suggestedPriority = 'medium';

  if (lower.includes('bug') || lower.includes('fix') || lower.includes('error') || lower.includes('issue')) {
    category = 'bug fix';
    suggestedPriority = 'high';
  } else if (lower.includes('deploy') || lower.includes('docker') || lower.includes('ci/cd') || lower.includes('release')) {
    category = 'DevOps / deployment';
    suggestedPriority = 'high';
  } else if (lower.includes('doc') || lower.includes('readme') || lower.includes('comment')) {
    category = 'documentation';
    suggestedPriority = 'low';
  } else if (lower.includes('test') || lower.includes('jest') || lower.includes('spec')) {
    category = 'quality assurance / testing';
    suggestedPriority = 'medium';
  } else if (lower.includes('auth') || lower.includes('security') || lower.includes('jwt') || lower.includes('login')) {
    category = 'security & authentication';
    suggestedPriority = 'high';
  }

  return {
    description: `[Fallback Draft] Complete ${category} for "${title}". Verify edge cases, conduct unit testing, and update relevant documentation before marking as completed.`,
    suggestedPriority
  };
};

/**
 * POST /api/ai/generate-description
 * Secure server-side AI integration supporting OpenAI & Gemini with graceful degradation.
 */
export const generateTaskDescription = async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Task title is required to generate a description.'
    });
  }

  // Rate Limiting Check
  const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const lastRequestTime = rateLimitMap.get(clientIp);
  const now = Date.now();

  if (lastRequestTime && now - lastRequestTime < COOLDOWN_MS) {
    const remainingSecs = Math.ceil((COOLDOWN_MS - (now - lastRequestTime)) / 1000);
    return res.status(429).json({
      success: false,
      error: `Rate limit reached. Please wait ${remainingSecs}s before generating again.`
    });
  }
  rateLimitMap.set(clientIp, now);

  const openaiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // 1. Try OpenAI API if key is present
  if (openaiApiKey && openaiApiKey !== 'your_openai_api_key_here') {
    try {
      const client = new OpenAI({ apiKey: openaiApiKey });
      const prompt = `You are a productivity assistant. Write a concise, professional, 2-3 sentence task description and actionable checklist for a task titled: "${title.trim()}". Return plain text only without markdown backticks.`;

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      });

      const description = completion.choices[0]?.message?.content?.trim();
      if (description) {
        return res.status(200).json({
          success: true,
          description,
          source: 'openai',
          fallback: false,
          disclaimer: '✨ AI-Generated Suggestion (OpenAI): Review and edit before saving.'
        });
      }
    } catch (apiError) {
      console.warn(`[AI Controller] OpenAI API call failed (${apiError.message}). Triggering graceful degradation.`);
      // Proceed to fallback
    }
  }

  // 2. Try Gemini API if key is present
  if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      const prompt = `Write a concise 2-sentence task description and deliverables for: "${title.trim()}". Return plain text only.`;

      const geminiRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const description = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (description) {
          return res.status(200).json({
            success: true,
            description,
            source: 'gemini',
            fallback: false,
            disclaimer: '✨ AI-Generated Suggestion (Gemini): Review and edit before saving.'
          });
        }
      }
    } catch (geminiError) {
      console.warn(`[AI Controller] Gemini API call failed (${geminiError.message}). Triggering graceful degradation.`);
      // Proceed to fallback
    }
  }

  // 3. Graceful Degradation Fallback (Triggered when API key is missing or third-party service fails)
  const fallbackData = generateContextualFallback(title.trim());

  return res.status(200).json({
    success: true,
    description: fallbackData.description,
    suggestedPriority: fallbackData.suggestedPriority,
    source: 'graceful_fallback',
    fallback: true,
    disclaimer: 'ℹ️ Fallback Suggestion: External AI service unavailable or unconfigured. Provided via local graceful degradation heuristics.'
  });
};
