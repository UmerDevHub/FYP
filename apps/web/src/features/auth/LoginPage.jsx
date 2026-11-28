import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@v360/shared/schemas';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../app/AuthProvider.jsx';
import { Button, Field } from '../../components/ui.jsx';
import { getStartPage, showServerFieldErrors, useLogIn } from './authHooks.js';

const LINK_CLASSES = 'inline-flex min-h-target items-center font-semibold text-petrol underline';

export default function LoginPage() {
  const { startSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logIn = useLogIn();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  function sendForm(form) {
    logIn.mutate(form, {
      onSuccess: (answer) => {
        startSession(answer.data);
        // Back to the page that asked for a login, or the start page of this role.
        navigate(location.state?.returnTo ?? getStartPage(answer.data.user.role), {
          replace: true,
        });
      },
      onError: (error) => showServerFieldErrors(error, setError),
    });
  }

  // One general message from the server: a wrong login, a locked account or too many attempts.
  const formError = logIn.isError && !logIn.error.details ? logIn.error.message : null;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-title">Log in</h1>
      <form onSubmit={handleSubmit(sendForm)} noValidate className="mt-6 flex flex-col gap-4">
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {formError && (
          <p role="alert" className="font-semibold text-fail">
            {formError}
          </p>
        )}
        <Button type="submit" isBusy={logIn.isPending}>
          Log in
        </Button>
      </form>
      <p className="mt-6">
        <Link to="/forgot-password" className={LINK_CLASSES}>
          Forgot your password?
        </Link>
      </p>
      <p>
        No account yet?{' '}
        <Link to="/register" className={LINK_CLASSES}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
