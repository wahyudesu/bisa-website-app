// import { inngest } from "./client";

// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event, step }) => {
//     await step.sleep("wait-a-moment", "1s");
//     return { message: `Hello ${event.data.email}!` };
//   },
// );

import { z } from "zod";
import { Message, NetworkRun, TextMessage, AgentResult } from "@inngest/agent-kit";
import { createAgent, createNetwork, openai, createTool } from "@inngest/agent-kit";
import { getSandbox, lastAssistantTextMessageContent } from './utils';
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";

const template = 'enggan-ngoding' 

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("enggan-ngoding");
      return sandbox.sandboxId;
    });

    const agent = createAgent({
      name: "Coding Agent",
      description: "An expert coding agent",
      system: `You are a coding agent help the user to achieve the described task.

      Once the task completed, you should return the following information:
      <task_summary>
      </task_summary>

      Think step-by-step before you start the task.
      `,
      model: openai({
        model: 'gpt-4o',
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: "https://ai.sumopod.com/v1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        // terminal use
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            console.log("terminal < ", command);
            const buffers = { stdout: "", stderr: "" };
            try {
              const sandbox = await getSandbox(template);
              const result = await sandbox.commands.run(command, {
                onStdout: (data) => { buffers.stdout += data; },
                onStderr: (data) => { buffers.stderr += data; },
              });
              console.log("terminal result >", result.stdout);
              return result.stdout;
            } catch (e) {
              console.error(`Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`);
              return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
            }
          },
        }),
        // create or update file
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(z.object({ path: z.string(), content: z.string() })),
          }),
          handler: async ({ files }, { step }) => {
            console.log("createOrUpdateFiles <", files.map((f) => f.path));
            try {
              const sandbox = await getSandbox(template);
              for (const file of files) {
                await sandbox.files.write(file.path, file.content);
              }
              return `Files created or updated: ${files.map((f) => f.path).join(", ")}`;
            } catch (e) {
              console.error("error", e);
              return "Error: " + e;
            }
          },
        }),
        // read files
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({ files: z.array(z.string()) }),
          handler: async ({ files }, { step }) => {
            console.log("readFiles <", files);
            try {
              const sandbox = await getSandbox(template);
              const contents = [];
              for (const file of files) {
                const content = await sandbox.files.read(file);
                contents.push({ path: file, content });
              }
              return JSON.stringify(contents);
            } catch (e) {
              console.error("error", e);
              return "Error: " + e;
            }
          },
        }),
        // run code
        createTool({
          name: "runCode",
          description: "Run the code in the sandbox",
          parameters: z.object({ code: z.string() }),
          handler: async ({ code }, { step }) => {
            console.log("runCode <", code);
            try {
              const sandbox = await getSandbox(template);
              const result = await sandbox.runCode(code);
              console.log("runCode result >", result);
              return result.logs.stdout.join("\n");
            } catch (e) {
              console.error("error", e);
              return "Error: " + e;
            }
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = lastAssistantTextMessageContent(result);
          if (lastAssistantMessageText && lastAssistantMessageText.includes("<task_summary>")) {
            network?.state.data.set("task_summary", lastAssistantMessageText);
          }
          return result;
        },
      },
      });


    const network = createNetwork({
      name: "Coding Network",
      agents: [agent],
      defaultModel: openai({
        model: "gpt-4o",
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: "https://ai.sumopod.com/v1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
    });

    // Jalankan agent di network
    const agentResult = await step.run('run-agent', async () => {
      // Menjalankan agent secara langsung, bukan network.run(string)
      const result = await agent.run(`Write the following snippet: ${event.data.value}`);
      return result.export();
    });

    const agentResultAsType = agentResult as unknown as AgentResult;
    const output = lastAssistantTextMessageContent(agentResultAsType);

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandboxUrl };
  }
);