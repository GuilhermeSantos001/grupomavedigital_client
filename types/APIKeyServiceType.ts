import { APIKeyType } from '@/types/APIKeyType'

export type DataAPIKey = Pick<APIKeyType, 'title' | 'key' | 'passphrase' | 'username' | 'userMail'>;

export type ResponseAPIKey = {
  data: APIKeyType
  delete: typeof DeleteAPIKey
} | undefined

declare function CreateAPIKey(key: DataAPIKey): Promise<ResponseAPIKey>
declare function SetAPIKey(key: ResponseAPIKey): void
declare function DeleteAPIKey(): Promise<boolean>

declare function DeleteAPIKeys(id: string): Promise<boolean>

export type FunctionCreateAPIKeyTypeof = typeof CreateAPIKey;
export type FunctionSetAPIKeyTypeof = typeof SetAPIKey;
export type FunctionDeleteAPIKeyTypeof = typeof DeleteAPIKey | undefined;

export type FunctionDeleteAPIKeysTypeof = typeof DeleteAPIKeys | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;