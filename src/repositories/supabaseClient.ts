import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isForbiddenSecretKey } from '../app/env';

export interface PublishableSupabaseConfig {
  url: string;
  publishableKey: string;
}

/**
 * Cliente browser com chave publicável apenas.
 * Nunca recebe service_role / sb_secret_*.
 */
export function createPublishableSupabaseClient(config: PublishableSupabaseConfig): SupabaseClient {
  if (isForbiddenSecretKey(config.publishableKey)) {
    throw new Error('Chave secreta/service_role recusada no cliente Supabase do browser.');
  }
  return createClient(config.url, config.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}
