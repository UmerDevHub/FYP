import { zodResolver } from '@hookform/resolvers/zod';
import { sellRequestSchema } from '@v360/shared/schemas';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button, Field, Select, Spinner, Textarea } from '../../components/ui.jsx';
import { showServerFieldErrors } from '../auth/authHooks.js';
import { useBranches, useSendSellRequest } from './sellHooks.js';

// FR-CU-11: branch first, then the car, then the price the customer expects and a description.
export default function SellYourCarPage() {
  const navigate = useNavigate();
  const branches = useBranches();
  const sendSellRequest = useSendSellRequest();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(sellRequestSchema) });

  function sendForm(form) {
    sendSellRequest.mutate(form, {
      onSuccess: () => navigate('/my-requests', { state: { message: 'Sell request sent.' } }),
      onError: (error) => showServerFieldErrors(error, setError),
    });
  }

  if (branches.isPending) {
    return (
      <p className="flex items-center gap-2 text-muted" role="status">
        <Spinner /> Loading the branches.
      </p>
    );
  }
  if (branches.isError) {
    return (
      <p role="alert" className="font-semibold text-fail">
        We could not load the branches. Reload the page to try again.
      </p>
    );
  }

  const branchOptions = [{ value: '', label: 'Choose a branch' }];
  for (const branch of branches.data) {
    branchOptions.push({ value: branch.id, label: `${branch.name}, ${branch.city}` });
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-title">Sell your car</h1>
      <p className="mt-2">
        Tell us about your car. The branch you choose will answer, and if they accept, you bring the
        car in for an inspection.
      </p>
      <form onSubmit={handleSubmit(sendForm)} noValidate className="mt-6 flex flex-col gap-4">
        <Select
          label="Branch"
          options={branchOptions}
          error={errors.branchId?.message}
          {...register('branchId')}
        />
        <Field
          label="Make"
          hint="For example Toyota."
          error={errors.make?.message}
          {...register('make')}
        />
        <Field
          label="Model"
          hint="For example Corolla."
          error={errors.model?.message}
          {...register('model')}
        />
        <Field
          label="Year"
          inputMode="numeric"
          error={errors.year?.message}
          {...register('year')}
        />
        <Field
          label="Mileage in km"
          inputMode="numeric"
          error={errors.mileageKm?.message}
          {...register('mileageKm')}
        />
        <Field
          label="Price you expect, in rupees"
          inputMode="numeric"
          hint="For example 2500000."
          error={errors.expectedPrice?.message}
          {...register('expectedPrice')}
        />
        <Textarea
          label="Description (optional)"
          hint="Anything the branch should know: repairs, accidents, service history."
          error={errors.description?.message}
          {...register('description')}
        />
        {sendSellRequest.isError && !sendSellRequest.error.details && (
          <p role="alert" className="font-semibold text-fail">
            {sendSellRequest.error.message}
          </p>
        )}
        <Button type="submit" isBusy={sendSellRequest.isPending}>
          Send sell request
        </Button>
      </form>
    </div>
  );
}
