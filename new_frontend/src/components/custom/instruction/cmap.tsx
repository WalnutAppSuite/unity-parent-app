import { useTranslation } from "react-i18next";


function CmapInstruction() {

    const { t } = useTranslation('cmap_instructions');

    return (
        <span className="tw-w-full tw-rounded-xl tw-text-primary tw-bg-primary/10 tw-p-2">
            {t('msg')} {" "}
            <a href="https://www.youtube.com/shorts/dx2VL1hZPqc" className="tw-font-bold">
                {t("hrefText")}
            </a>
        </span>
    )
}

export default CmapInstruction;