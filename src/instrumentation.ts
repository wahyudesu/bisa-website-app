// export async function register() {
//   // prevent this from running in the edge runtime
//   if (process.env.NEXT_RUNTIME === 'nodejs') {
//     const { Laminar } = await import('@lmnr-ai/lmnr');
//     Laminar.initialize({
//       projectApiKey: process.env.LMNR_API_KEY,
//     });
//   }
// }

// import { registerOTel } from "@vercel/otel";
 
// export function register() {
//   registerOTel({
//     serviceName: "multi-step-tool-calls-demo",
//   });
// }

import { registerOTel } from '@vercel/otel';
import { AISDKExporter } from 'langsmith/vercel';

export function register() {
  registerOTel({
    serviceName: 'langsmith-vercel-ai-sdk-example',
    traceExporter: new AISDKExporter(),
  });
}