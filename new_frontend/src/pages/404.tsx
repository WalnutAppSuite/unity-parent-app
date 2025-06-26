import { useTranslation } from "react-i18next";

export default function NotFound() {
    const { t } = useTranslation("not_found");
    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-[80vh] tw-text-center tw-text-primary tw-font-semibold">
            <h1 className="tw-text-5xl tw-font-bold tw-mb-4">404</h1>
            <h2 className="tw-text-2xl tw-font-semibold tw-mb-2">{t("title")}</h2>
            <p className="tw-text-lg tw-text-primary/70 tw-font-normal">{t("description")}</p>
        </div>
    );
}