import { zodResolver } from '@hookform/resolvers/zod';
import { ROLE, SELL_REQUEST_STATUS } from '@v360/shared/constants';
import { rejectSellRequestSchema } from '@v360/shared/schemas';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { Dialog } from '../../components/feedback.jsx';
import { Button, Textarea } from '../../components/ui.jsx';
import { useAcceptSellRequest, useRejectSellRequest } from './staffHooks.js';

function RejectDialog({ sellRequest, isOpen, onClose }) {
  const rejectRequest = useRejectSellRequest();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(rejectSellRequestSchema) });

  function sendForm(form) {
    rejectRequest.mutate({ id: sellRequest.id, body: form }, { onSuccess: onClose });
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Reject this sell request?">
      <form onSubmit={handleSubmit(sendForm)} noValidate className="flex flex-col gap-4">
        <Textarea
          label="Reason"
          hint="The customer sees this reason."
          error={errors.reason?.message}
          {...register('reason')}
        />
        {rejectRequest.isError && (
          <p role="alert" className="font-semibold text-fail">
            {rejectRequest.error.message}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="danger" isBusy={rejectRequest.isPending}>
            Reject request
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Go back
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

// The buttons on one row: the manager decides a pending request (FR-BM-01); sales staff record
// the arrival of an accepted one (FR-SS-01).
export default function SellRequestActions({ sellRequest, role }) {
  const acceptRequest = useAcceptSellRequest();
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const isPending = sellRequest.status === SELL_REQUEST_STATUS.PENDING;
  const isAccepted = sellRequest.status === SELL_REQUEST_STATUS.ACCEPTED;

  if (role === ROLE.BRANCH_MANAGER && isPending) {
    return (
      <div className="flex flex-wrap gap-3">
        <Button
          isBusy={acceptRequest.isPending}
          onClick={() => acceptRequest.mutate({ id: sellRequest.id })}
        >
          Accept
        </Button>
        <Button variant="secondary" onClick={() => setIsRejectOpen(true)}>
          Reject
        </Button>
        {acceptRequest.isError && (
          <p role="alert" className="w-full font-semibold text-fail">
            {acceptRequest.error.message}
          </p>
        )}
        <RejectDialog
          sellRequest={sellRequest}
          isOpen={isRejectOpen}
          onClose={() => setIsRejectOpen(false)}
        />
      </div>
    );
  }

  if (role === ROLE.SALES_STAFF && isAccepted) {
    return (
      <Link
        to={`/staff/arrivals/new?sellRequestId=${sellRequest.id}`}
        className="inline-flex min-h-target items-center rounded-control bg-petrol px-4 font-heading text-card font-semibold text-paper"
      >
        Record arrival
      </Link>
    );
  }

  return null;
}
