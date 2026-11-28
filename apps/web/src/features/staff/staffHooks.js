import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';

// status is optional: without it the list holds every status of the branch.
export function useBranchSellRequests(status) {
  let path = '/sell-requests';
  if (status) {
    path = `/sell-requests?status=${status}`;
  }
  return useQuery({
    queryKey: ['sell-requests', 'branch', status],
    queryFn: () => api(path).then((answer) => answer.data),
  });
}

// Only asks the server when there is an id (a walk-in arrival has none).
export function useSellRequest(sellRequestId) {
  return useQuery({
    queryKey: ['sell-requests', sellRequestId],
    queryFn: () => api(`/sell-requests/${sellRequestId}`).then((answer) => answer.data),
    enabled: Boolean(sellRequestId),
  });
}

function useSellRequestAction(makePath, method = 'POST') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => api(makePath(id), { method, body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sell-requests'] }),
  });
}

export function useAcceptSellRequest() {
  return useSellRequestAction((id) => `/sell-requests/${id}/accept`);
}

export function useRejectSellRequest() {
  return useSellRequestAction((id) => `/sell-requests/${id}/reject`);
}

export function useRecordArrival() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form) => api('/vehicles/arrivals', { method: 'POST', body: form }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sell-requests'] }),
  });
}
