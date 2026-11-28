// SQL only.
export async function insertVehicle(trx, vehicle) {
  const [saved] = await trx('vehicles').insert(vehicle).returning('*');
  return saved;
}
