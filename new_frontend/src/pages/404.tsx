import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const { t } = useTranslation("not_found");
    const navigate = useNavigate();
    const location = useLocation();
    const [count, setCount] = useState(5);

    // Determine where to redirect (last valid page or home)
    const redirectTo = (location.state && location.state.from) ? location.state.from : "/notices";

    useEffect(() => {
        // Countdown timer
        if (count > 0) {
            const timer = setTimeout(() => setCount(count - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            navigate(redirectTo, { replace: true });
        }
    }, [count, navigate, redirectTo]);

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-[80vh] tw-text-center tw-text-primary tw-font-semibold">
            <h1 className="tw-text-5xl tw-font-bold tw-mb-4">404</h1>
            <h2 className="tw-text-2xl tw-font-semibold tw-mb-2">{t("title")}</h2>
            <p className="tw-text-lg tw-text-primary/70 tw-font-normal">{t("description")}</p>
            <p className="tw-text-sm tw-text-primary/50">
                Redirecting in {count} second{count !== 1 ? "s" : ""}...
            </p>
            <button
                className="tw-mt-4 tw-px-4 tw-py-2 tw-bg-primary tw-text-white tw-rounded hover:tw-bg-primary/80 tw-transition"
                onClick={() => navigate(redirectTo, { replace: true })}
            >
                Click here if you are not redirected
            </button>
        </div>
    );
}