import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema } from '@v360/shared/schemas';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { z } from 'zod';
import { useAuth } from '../../app/AuthProvider.jsx';
import { Button, Field } from '../../components/ui.jsx';
import { useResetPassword } from './authHooks.js';

const LINK_CLASSES = 'inline-flex min-h-target items-center font-semibold text-petrol underline';

// The new password follows the shared rule. Typing it twice is a screen-only check: the server
// gets one password.
const resetFormSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine((form) => form.password === form.confirmPassword, {
    path: ['confirmPassword'],
    message: 'The two passwords are not the same.',
  });

function AskForNewLink({ message }) {
  return (
    <>
      <p role="alert" className="font-semibold text-fail">
        {message}
      </p>
      <Link to="/forgot-password" className={LINK_CLASSES}>
        Ask for a new link
      </Link>
    </>
  );
}

// FR-AU-04: opened from the link in the e-mail (/reset-password?token=...).
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { endSession } = useAuth();
  const resetPassword = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetFormSchema) });

  function sendForm(form) {
    resetPassword.mutate(
      { token, password: form.password },
      {
        // The reset ended every login of this account on the server (FR-AU-04): end it here too.
        onSuccess: (answer) => {
          endSession();
          navigate('/login', { state: { message: answer.data.message } });
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-title">Choose a new password</h1>
      {!token ? (
        <div className="mt-6 flex flex-col gap-2">
          <AskForNewLink message="This link is not complete. Open the link from the e-mail again." />
        </div>
      ) : (
        <form onSubmit={handleSubmit(sendForm)} noValidate className="mt-6 flex flex-col gap-4">
          <Field
            label="New password"
            type="password"
            autoComplete="new-password"
            hint="At least 8 characters, with a letter and a number."
            error={errors.password?.message}
            {...register('password')}
          />
          <Field
            label="New password again"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {resetPassword.isError && <AskForNewLink message={resetPassword.error.message} />}
          <Button type="submit" isBusy={resetPassword.isPending}>
            Save new password
          </Button>
        </form>
      )}
    </div>
  );
}
