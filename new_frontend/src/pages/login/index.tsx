import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function Login() {
  const { t } = useTranslation('login');
  return (
    <div className='tw-w-full tw-h-screen tw-bg-custom-gradient tw-text-white tw-flex tw-flex-col tw-p-4'>
      <h2 className="tw-font-grotesk tw-text-5xl tw-text-secondary">{t('label')}</h2>
      <div className='tw-flex tw-justify-center tw-items-center tw-border tw-border-secondary tw-rounded-lg tw-p-2'>
        <span>{t('input_span')}</span>
        <Input placeholder={t('input_placeholder')} className='tw-border-none tw-placeholder-secondary'/>
      </div>
      <p className="tw-font-grotesk tw-text-xl tw-text-white">{t('subtitle')}</p>
      <Button>{t('button')}</Button>
    </div>
  );
}

export default Login;
