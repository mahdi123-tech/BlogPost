import {genkit} from 'genkit';
import {next} from '@genkit-ai/next';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [next(), googleAI()],
  enableTracingAndMetrics: true,
});
