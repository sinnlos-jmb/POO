const { OpenRouter } = require('@openrouter/sdk');

const openRouter = new OpenRouter({
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>',
    'X-Title': 'Philosophy YES',
  },
});

async function complet() {
  const completion = await openRouter.chat.send({
    model: 'openai/gpt-5-nano', //deepseek/deepseek-v3.2-exp x-ai/grok-3-mini x-ai/grok-4-fast meta-llama/llama-4-maverick:free qwen/qwen3-30b-a3b:free qwen/qwen3-235b-a22b:free openai/gpt-4o openai/gpt-oss-20b:free *moonshotai/moonlight-16b-a3b-instruct  alibaba/tongyi-deepresearch-30b-a3b:free *nvidia/nemotron-nano-12b-v2-vl:free
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
    stream: false,
  });
  return completion;
}

/* Función wrapper async
(async () => {
  const rta = await complet();
  console.log(rta.choices[0].message.content);
})();
*/
complet().then(rta => {
  console.log(rta.choices[0].message.content);
});