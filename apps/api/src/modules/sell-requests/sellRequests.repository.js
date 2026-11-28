import { ROLE } from '@v360/shared/constants';
import { db } from '../../config/db.js';

// SQL only. Every list names its columns, so no private column leaves by accident.
const SELL_REQUEST_COLUMNS = [
  'sellRequests.id',
  'sellRequests.customerId',
  'sellRequests.branchId',
  'sellRequests.make',
  'sellRequests.model',
  'sellRequests.year',
  'sellRequests.mileageKm',
  'sellRequests.expectedPrice',
  'sellRequests.description',
  'sellRequests.status',
  'sellRequests.decisionReason',
  'sellRequests.expiresAt',
  'sellRequests.createdAt',
  'branches.name as branchName',
  'users.name as customerName',
  'users.phone as customerPhone',
  'users.email as customerEmail',
];

function selectSellRequests() {
  return db('sellRequests')
    .join('branches', 'branches.id', 'sellRequests.branchId')
    .join('users', 'users.id', 'sellRequests.customerId')
    .select(SELL_REQUEST_COLUMNS);
}

export async function insertSellRequest(trx, sellRequest) {
  const [saved] = await trx('sellRequests').insert(sellRequest).returning(['id']);
  return saved.id;
}

export function findSellRequestById(id) {
  return selectSellRequests().where('sellRequests.id', id).first();
}

export function findSellRequestsOfCustomer(customerId) {
  return selectSellRequests()
    .where('sellRequests.customerId', customerId)
    .orderBy('sellRequests.createdAt', 'desc');
}

// status is optional: without it, every status of the branch.
export function findSellRequestsOfBranch(branchId, status) {
  const query = selectSellRequests().where('sellRequests.branchId', branchId);
  if (status) {
    query.where('sellRequests.status', status);
  }
  return query.orderBy('sellRequests.createdAt', 'desc');
}

export function findActiveBranch(branchId) {
  return db('branches').select(['id', 'name']).where({ id: branchId, isActive: true }).first();
}

export function findBranchManagers(branchId) {
  return db('users')
    .select(['id', 'email'])
    .where({ role: ROLE.BRANCH_MANAGER, branchId, isActive: true });
}
