import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, updateMeSchema } from '@v360/shared/schemas';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toast } from '../../components/feedback.jsx';
import { Button, Field, Spinner } from '../../components/ui.jsx';
import { useChangePassword, useMyDetails, useUpdateMyDetails } from './accountHooks.js';

// FR-AU-05: only the name and phone can change. The e-mail is shown, not edited.
function DetailsForm({ details, onSaved }) {
  const updateDetails = useUpdateMyDetails();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateMeSchema),
    defaultValues: { name: details.name, phone: details.phone ?? '' },
  });

  function sendForm(form) {
    updateDetails.mutate(form, { onSuccess: () => onSaved('Your details are saved.') });
  }

  return (
    <form onSubmit={handleSubmit(sendForm)} noValidate className="mt-4 flex flex-col gap-4">
      <p>
        E-mail: <span className="font-semibold">{details.email}</span>
      </p>
      <Field label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
      <Field
        label="Mobile number"
        type="tel"
        autoComplete="tel"
        hint="For example 0300-1234567."
        error={errors.phone?.message}
        {...register('phone')}
      />
      {updateDetails.isError && (
        <p role="alert" className="font-semibold text-fail">
          {updateDetails.error.message}
        </p>
      )}
      <Button type="submit" isBusy={updateDetails.isPending}>
        Save details
      </Button>
    </form>
  );
}

function PasswordForm({ onSaved }) {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  function sendForm(form) {
    changePassword.mutate(form, {
      onSuccess: () => {
        reset();
        onSaved('Your password is changed. Other devices are logged out.');
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(sendForm)} noValidate className="mt-4 flex flex-col gap-4">
      <Field
        label="Old password"
        type="password"
        autoComplete="current-password"
        error={errors.oldPassword?.message}
        {...register('oldPassword')}
      />
      <Field
        label="New password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters, with a letter and a number."
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      {changePassword.isError && (
        <p role="alert" className="font-semibold text-fail">
          {changePassword.error.message}
        </p>
      )}
      <Button type="submit" variant="secondary" isBusy={changePassword.isPending}>
        Change password
      </Button>
    </form>
  );
}

export default function AccountPage() {
  const myDetails = useMyDetails();
  const [toastMessage, setToastMessage] = useState(null);

  if (myDetails.isPending) {
    return (
      <p className="flex items-center gap-2 text-muted" role="status">
        <Spinner /> Loading your details.
      </p>
    );
  }
  if (myDetails.isError) {
    return (
      <p role="alert" className="font-semibold text-fail">
        We could not load your details. Reload the page to try again.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-title">My account</h1>
      <section className="mt-8">
        <h2 className="text-section">Your details</h2>
        <DetailsForm details={myDetails.data} onSaved={setToastMessage} />
      </section>
      <section className="mt-8 border-t border-line pt-8">
        <h2 className="text-section">Change your password</h2>
        <PasswordForm onSaved={setToastMessage} />
      </section>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
