/* =========================================
   CEREBRAS API CONFIGURATION
   Iron Man STEM Mission Interface
   Worker URL + model settings
   ========================================= */

const CEREBRAS_CONFIG = {
  // Cloudflare Worker proxy URL (handles auth + CORS)
  // Replace with your deployed worker URL
  workerUrl: 'https://ironman-api.shanewaldrop123.workers.dev',

  // Model: Qwen3-235B MoE (22B active) via Cerebras inference
  model: 'qwen-3-235b-a22b',

  // Generation parameters
  temperature: 0.7,
  maxTokens: 4096,

  // Network resilience
  timeout: 30000,     // 30s — LLM generation can be slow
  retries: 2,         // Total attempts = retries + 1
  retryDelay: 1000,   // Base delay in ms, multiplied by attempt number

  // Mission structure (must match game flow)
  mathProblemsPerMission: 10,
  scienceQuestionsPerMission: 3,
  scienceAfterFirewalls: [3, 6, 9]
};

// Expose globally
window.CEREBRAS_CONFIG = CEREBRAS_CONFIG;

console.log('[Config] CEREBRAS_CONFIG loaded');
