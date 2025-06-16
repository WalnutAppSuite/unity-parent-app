import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { t } = useTranslation('login');
  const navigate = useNavigate();

  const auth = useAuth();

  const user = import.meta.env.VITE_USR || '';
  const password = import.meta.env.VITE_PWD || '';

  const handleLogin = () => {
    console.log('Login button clicked');
    auth.mutate(
      {
        usr: user || '',
        pwd: password || '',
      },
      {
        onSuccess: () => {
          console.log('Login successful');
          navigate('/notices');
        },
        onError: (error: unknown) => {
          console.error('Login failed:', error);
          alert(t('loginFailed'));
        },
      }
    );
  };

  return (
    <div className='tw-w-full tw-h-screen tw-bg-custom-gradient tw-text-white tw-flex tw-flex-col tw-p-4 tw-items-center tw-justify-center'>
      <Button onClick={handleLogin}>{t('button')}</Button>
    </div>
  );
}

export default Login;
