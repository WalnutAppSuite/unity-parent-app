import { useTranslation } from "react-i18next";

function CmapInstruction() {

    const { t } = useTranslation('early_instructions');

    return (
        <div className="tw-w-full tw-rounded-xl tw-text-primary tw-bg-primary/10 tw-p-2 tw-text-center">
            {t('msg')}
        </div>
    )
}

export default CmapInstruction;