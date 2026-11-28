import { zodResolver } from '@hookform/resolvers/zod';
import { FUEL_TYPES, TRANSMISSIONS } from '@v360/shared/constants';
import { arrivalSchema } from '@v360/shared/schemas';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import { Button, Field, Select, Spinner, Textarea } from '../../components/ui.jsx';
import { PlateBadge } from '../../components/vehicle.jsx';
import { showServerFieldErrors } from '../auth/authHooks.js';
import { useRecordArrival, useSellRequest } from './staffHooks.js';

function makeOptions(words, firstLabel) {
  const options = [{ value: '', label: firstLabel }];
  for (const word of words) {
    options.push({ value: word, label: word.charAt(0).toUpperCase() + word.slice(1) });
  }
  return options;
}

const FUEL_OPTIONS = makeOptions(FUEL_TYPES, 'Choose the fuel type');
const TRANSMISSION_OPTIONS = makeOptions(TRANSMISSIONS, 'Choose the transmission');

// The form itself. startValues come from the sell request, or are empty for a walk-in.
function ArrivalForm({ sellRequestId, startValues }) {
  const navigate = useNavigate();
  const recordArrival = useRecordArrival();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(arrivalSchema), defaultValues: startValues });
  const registrationNo = watch('registrationNo');

  function sendForm(form) {
    recordArrival.mutate(
      { ...form, sellRequestId },
      {
        onSuccess: (answer) => {
          const car = answer.data;
          const message = `Arrival recorded. The ${car.year} ${car.make} ${car.model} is now Received.`;
          navigate('/staff/sell-requests?status=accepted', { state: { message } });
        },
        onError: (error) => showServerFieldErrors(error, setError),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(sendForm)} noValidate className="mt-6 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Make" error={errors.make?.message} {...register('make')} />
        <Field label="Model" error={errors.model?.message} {...register('model')} />
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
        <Select
          label="Fuel"
          options={FUEL_OPTIONS}
          error={errors.fuelType?.message}
          {...register('fuelType')}
        />
        <Select
          label="Transmission"
          options={TRANSMISSION_OPTIONS}
          error={errors.transmission?.message}
          {...register('transmission')}
        />
        <Field label="Colour" error={errors.colour?.message} {...register('colour')} />
        <Field
          label="Chassis number"
          error={errors.chassisNo?.message}
          {...register('chassisNo')}
        />
      </div>
      <Field
        label="Registration number"
        hint="As on the number plate, for example LEA-1234."
        error={errors.registrationNo?.message}
        {...register('registrationNo')}
      />
      {registrationNo && (
        <p className="flex items-center gap-3">
          <span className="text-small text-muted">On the plate:</span>
          <PlateBadge registrationNumber={registrationNo.toUpperCase()} />
        </p>
      )}
      <Textarea
        label="Notes (optional)"
        error={errors.description?.message}
        {...register('description')}
      />
      {recordArrival.isError && !recordArrival.error.details && (
        <p role="alert" className="font-semibold text-fail">
          {recordArrival.error.message}
        </p>
      )}
      <Button type="submit" isBusy={recordArrival.isPending}>
        Record arrival
      </Button>
    </form>
  );
}

// FR-SS-01: from an accepted sell request (?sellRequestId=12), or a walk-in without one.
export default function ArrivalPage() {
  const [searchParams] = useSearchParams();
  const sellRequestId = searchParams.get('sellRequestId');
  const sellRequest = useSellRequest(sellRequestId);

  if (!sellRequestId) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-title">Record a walk-in arrival</h1>
        <p className="mt-2">A car that arrives without a sell request.</p>
        <ArrivalForm startValues={{}} />
      </div>
    );
  }
  if (sellRequest.isPending) {
    return (
      <p className="flex items-center gap-2 text-muted" role="status">
        <Spinner /> Loading the sell request.
      </p>
    );
  }
  if (sellRequest.isError) {
    return (
      <p role="alert" className="font-semibold text-fail">
        {sellRequest.error.message}
      </p>
    );
  }

  const request = sellRequest.data;
  const startValues = {
    make: request.make,
    model: request.model,
    year: String(request.year),
    mileageKm: String(request.mileageKm),
  };
  return (
    <div className="max-w-2xl">
      <h1 className="text-title">Record arrival</h1>
      <p className="mt-2">
        {request.customerName} brings the {request.year} {request.make} {request.model}. Check the
        details against the car and its documents.
      </p>
      <ArrivalForm sellRequestId={Number(sellRequestId)} startValues={startValues} />
    </div>
  );
}
