import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

function Login() {
  const { t } = useTranslation('login');
  const navigate = useNavigate();

  const [user, setUser] = useState(import.meta.env.VITE_USR);
  const [password, setPassword] = useState(import.meta.env.VITE_PWD);
  const auth = useAuth();

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
    <div className='tw-w-full tw-h-screen tw-bg-custom-gradient tw-text-white tw-flex tw-flex-col tw-gap-4 tw-p-4 tw-items-center tw-justify-center'>
      <Input type='text' className="" placeholder='username' value={user} onChange={(e) => setUser(e.target.value)} />
      <Input type='text' className="" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
      <Button onClick={handleLogin}>{t('button')}</Button>
    </div>
  );
}

export default Login;
