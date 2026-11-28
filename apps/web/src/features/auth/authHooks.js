import { useMutation } from '@tanstack/react-query';
import { ROLE } from '@v360/shared/constants';
import { api } from '../../lib/api.js';

export function useLogIn() {
  return useMutation({ mutationFn: (form) => api('/auth/login', { method: 'POST', body: form }) });
}

export function useRegister() {
  return useMutation({
    mutationFn: (form) => api('/auth/register', { method: 'POST', body: form }),
  });
}

// After login, each role starts on its own page.
export function getStartPage(role) {
  return role === ROLE.CUSTOMER ? '/sell' : '/staff';
}

// The server checks the same schema. If it still refuses a field (for example a used e-mail),
// show its message under that field. Returns true when a field got a message.
export function showServerFieldErrors(error, setError) {
  const fieldMessages = Object.entries(error.details ?? {});
  for (const [field, messages] of fieldMessages) {
    setError(field, { message: messages[0] });
  }
  return fieldMessages.length > 0;
}
