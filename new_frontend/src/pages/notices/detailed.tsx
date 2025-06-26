import { useLocation } from "react-router-dom";
import useNoticeDetails from "@/hooks/useNoticeDetailed";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useRef } from "react";

function NoticeShadowContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Only create shadow root if it doesn't exist
      if (!containerRef.current.shadowRoot) {
        const shadow = containerRef.current.attachShadow({ mode: "open" });
        shadow.innerHTML = html || "";
      } else {
        // Update existing shadow root content
        containerRef.current.shadowRoot.innerHTML = html || "";
      }
    }
  }, [html]);

  return (
    <div ref={containerRef} style={{ minHeight: 120 }} />
  );
}

function DetailedNotices() {
  const location = useLocation();
  const { notice, studentId } = location.state || {};
  const { t } = useTranslation("notices");

  const { data, isLoading, error } = useNoticeDetails({ id: notice, student: studentId });

  if (isLoading) {
    return (
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-start tw-h-[60vh]">
        <Skeleton className="tw-w-full tw-h-32 tw-mb-2" />
        <Skeleton className="tw-w-full tw-h-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-[60vh]">
        <p className="tw-text-red-500 tw-font-semibold">{t("error", "Failed to load notice details.")}</p>
      </div>
    );
  }

  const noticeData = data?.message?.data || data?.data?.message?.data || data?.data;

  return (
    <div className="tw-max-w-2xl tw-mx-auto tw-text-primary">
      <div className="tw-flex tw-flex-col tw-items-center tw-p-6 tw-text-center tw-bg-primary tw-text-secondary">
        <h1 className="tw-text-xl tw-font-bold tw-mb-2">{noticeData?.subject || t("noSubject", "No Subject")}</h1>
        <div className="tw-flex tw-items-center tw-gap-3">
          <Badge className="tw-bg-secondary/10 tw-text-secondary tw-text-xs">{noticeData?.student_first_name || studentId}</Badge>
          <span className="tw-flex tw-items-center tw-gap-1 tw-text-secondary/70 tw-text-sm">
            <CalendarDays className="tw-w-4 tw-h-4" />
            {noticeData?.creation
              ? formatDate(new Date(noticeData.creation).toLocaleDateString())
              : ""}
          </span>
        </div>
      </div>
      <div className="tw-bg-gray-50 tw-p-6 tw-min-h-[120px]">
        <NoticeShadowContent html={noticeData?.notice || ""} />
      </div>
    </div>
  );
}

export default DetailedNotices;