// NFR-SC-10: important changes are stored with the user and the time. The app never edits these rows.
// Called by services, inside their transaction (trx), so the log and the change are saved together.
export function logActivity(trx, { userId, action, entityType, entityId, oldValue, newValue }) {
  return trx('activityLogs').insert({
    userId,
    action,
    entityType,
    entityId,
    oldValue: oldValue === undefined ? null : JSON.stringify(oldValue),
    newValue: newValue === undefined ? null : JSON.stringify(newValue),
  });
}
