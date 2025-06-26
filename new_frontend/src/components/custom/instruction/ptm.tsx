import { useTranslation } from 'react-i18next';

function PTMInstruction() {

    const { t } = useTranslation('ptm_instruction');

    return (
        <div className="tw-w-full tw-rounded-xl tw-text-[12px] tw-text-primary tw-bg-primary/10 tw-p-2 tw-text-center">
            {t('msg')}
        </div>
    )
}

export default PTMInstruction;