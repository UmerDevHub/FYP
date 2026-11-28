import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';

export function useMyDetails() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api('/auth/me').then((answer) => answer.data),
  });
}

export function useUpdateMyDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form) => api('/auth/me', { method: 'PATCH', body: form }),
    // The server answers with the saved details: show them without asking again.
    onSuccess: (answer) => queryClient.setQueryData(['me'], answer.data),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (form) => api('/auth/change-password', { method: 'POST', body: form }),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => api('/notifications').then((answer) => answer.data),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId) =>
      api(`/notifications/${notificationId}/read`, { method: 'PATCH' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
