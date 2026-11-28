import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: () => api('/branches').then((answer) => answer.data),
  });
}

export function useMySellRequests() {
  return useQuery({
    queryKey: ['sell-requests', 'mine'],
    queryFn: () => api('/sell-requests/mine').then((answer) => answer.data),
  });
}

export function useSendSellRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form) => api('/sell-requests', { method: 'POST', body: form }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sell-requests'] }),
  });
}
