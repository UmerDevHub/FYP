import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@v360/shared/schemas';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { Button, Field } from '../../components/ui.jsx';
import { useForgotPassword } from './authHooks.js';

const LINK_CLASSES = 'inline-flex min-h-target items-center font-semibold text-petrol underline';

// FR-AU-04: one field and one button. After sending, the page shows the server's sentence, which
// is the same for every e-mail, so it never tells anyone whether an account exists.
export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  if (forgotPassword.isSuccess) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="text-title">Check your e-mail</h1>
        <p className="mt-4" role="status">
          {forgotPassword.data.data.message}
        </p>
        <p className="mt-2 text-muted">The link works once, for 60 minutes.</p>
        <Link to="/login" className={`mt-4 ${LINK_CLASSES}`}>
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-title">Forgot your password?</h1>
      <p className="mt-2">
        Enter the e-mail of your account. We will send you a link to choose a new password.
      </p>
      <form
        onSubmit={handleSubmit((form) => forgotPassword.mutate(form))}
        noValidate
        className="mt-6 flex flex-col gap-4"
      >
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        {forgotPassword.isError && (
          <p role="alert" className="font-semibold text-fail">
            {forgotPassword.error.message}
          </p>
        )}
        <Button type="submit" isBusy={forgotPassword.isPending}>
          Send reset link
        </Button>
      </form>
      <Link to="/login" className={`mt-6 ${LINK_CLASSES}`}>
        Back to log in
      </Link>
    </div>
  );
}
