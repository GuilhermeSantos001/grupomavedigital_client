import { SWRConfiguration } from 'swr';

export const SWRConfig: SWRConfiguration = {
  refreshInterval: 1000,
  revalidateOnReconnect: true,
  revalidateOnFocus: false,
  revalidateOnMount: false,
}