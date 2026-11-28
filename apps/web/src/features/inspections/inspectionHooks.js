import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, uploadWithProgress } from '../../lib/api.js';

function withStatus(path, status) {
  if (status) {
    return `${path}?status=${status}`;
  }
  return path;
}

export function useInspections(status) {
  return useQuery({
    queryKey: ['inspections', 'list', status],
    queryFn: () => api(withStatus('/inspections', status)).then((answer) => answer.data),
  });
}

export function useInspection(inspectionId) {
  return useQuery({
    queryKey: ['inspections', inspectionId],
    queryFn: () => api(`/inspections/${inspectionId}`).then((answer) => answer.data),
  });
}

export function useBranchVehicles(status) {
  return useQuery({
    queryKey: ['vehicles', 'manage', status],
    queryFn: () => api(withStatus('/vehicles/manage', status)).then((answer) => answer.data),
  });
}

// After any change, the inspection and the lists are loaded again.
function useInspectionChange(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useStartInspection() {
  return useInspectionChange((vehicleId) =>
    api('/inspections', { method: 'POST', body: { vehicleId } }),
  );
}

export function useSaveDraft(inspectionId) {
  return useInspectionChange((draft) =>
    api(`/inspections/${inspectionId}`, { method: 'PUT', body: draft }),
  );
}

export function useSubmitInspection(inspectionId) {
  return useInspectionChange(() => api(`/inspections/${inspectionId}/submit`, { method: 'POST' }));
}

// One photo with its caption. onProgress gets 0 to 100 while the file is sent.
export function useUploadPhoto(inspectionId) {
  return useInspectionChange(({ file, caption, onProgress }) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', caption);
    return uploadWithProgress(`/inspections/${inspectionId}/photos`, formData, onProgress);
  });
}
