import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@v360/shared/schemas';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../app/AuthProvider.jsx';
import { Button, Field } from '../../components/ui.jsx';
import { getStartPage, showServerFieldErrors, useRegister } from './authHooks.js';

// FR-AU-01: a visitor registers as a customer with name, e-mail, phone and password.
export default function RegisterPage() {
  const { startSession } = useAuth();
  const navigate = useNavigate();
  const registerAccount = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  function sendForm(form) {
    registerAccount.mutate(form, {
      onSuccess: (answer) => {
        startSession(answer.data);
        navigate(getStartPage(answer.data.user.role), { replace: true });
      },
      onError: (error) => showServerFieldErrors(error, setError),
    });
  }

  const formError =
    registerAccount.isError && !registerAccount.error.details
      ? registerAccount.error.message
      : null;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-title">Create an account</h1>
      <p className="mt-2 text-muted">With an account you can sell your car to AK Motors.</p>
      <form onSubmit={handleSubmit(sendForm)} noValidate className="mt-6 flex flex-col gap-4">
        <Field
          label="Name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          hint="For example 0300-1234567."
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters, with a letter and a number."
          error={errors.password?.message}
          {...register('password')}
        />
        {formError && (
          <p role="alert" className="font-semibold text-fail">
            {formError}
          </p>
        )}
        <Button type="submit" isBusy={registerAccount.isPending}>
          Create account
        </Button>
      </form>
      <p className="mt-6">
        Already have an account?{' '}
        <Link
          to="/login"
          className="inline-flex min-h-target items-center font-semibold text-petrol underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
