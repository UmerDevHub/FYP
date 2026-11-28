import { db } from '../../config/db.js';

// SQL only.
export async function insertVehicle(trx, vehicle) {
  const [saved] = await trx('vehicles').insert(vehicle).returning('*');
  return saved;
}

// The cars of one branch, newest first. status is optional (no status: every status).
export function findVehiclesOfBranch(branchId, status) {
  const query = db('vehicles')
    .select([
      'id',
      'make',
      'model',
      'year',
      'mileageKm',
      'colour',
      'registrationNo',
      'status',
      'sellingPrice',
      'receivedAt',
    ])
    .where({ branchId, isDeleted: false });
  if (status) {
    query.where({ status });
  }
  return query.orderBy('receivedAt', 'desc');
}

export function findVehicleById(vehicleId) {
  return db('vehicles').where({ id: vehicleId, isDeleted: false }).first();
}
