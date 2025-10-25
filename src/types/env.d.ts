declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_RESEND_API_KEY: string;
      NEXT_PUBLIC_SOLANA_RPC_URL: string;
    }
  }
}

export {};
