declare module 'groq-sdk' {
  export interface ChatCompletion {
    choices: Array<{
      delta: {
        content?: string;
      };
    }>;
  }

  export interface ChatCompletionCreateParams {
    model: string;
    messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }>;
    stream: boolean;
    temperature?: number;
    max_tokens?: number;
  }

  export interface Groq {
    chat: {
      completions: {
        create(params: ChatCompletionCreateParams): AsyncIterable<ChatCompletion>;
      };
    };
  }

  export default class Groq {
    constructor(config: { apiKey: string });
    chat: {
      completions: {
        create(params: ChatCompletionCreateParams): AsyncIterable<ChatCompletion>;
      };
    };
  }
}
