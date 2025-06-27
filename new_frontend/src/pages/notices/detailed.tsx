import { useLocation } from "react-router-dom";
import useNoticeDetails from "@/hooks/useNoticeDetailed";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Archive, CalendarDays, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useRef, useState } from "react";
import useNoticeActions from "@/hooks/useNoticeActions";
import { toast } from "sonner";
import type { Notice } from "@/types/notice";

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
  const { toggleStar, toggleArchive, isStarring, isArchiving } = useNoticeActions();
  const { data, isLoading, error } = useNoticeDetails({ id: notice, student: studentId });
  const [isStarred, setIsStarred] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setIsStarred(data.data.is_stared === 1);
      setIsArchived(data.data.is_archived === 1);
    }
  }, [data]);

  const handleStarClick = (noticeData: Notice) => {
    console.log(noticeData);

    toggleStar(noticeData);
    setIsStarred((prev) => !prev);
    if (isStarred) {
      toast.success("Notice unstarred successfully!");
    } else {
      toast.success("Notice starred successfully!");
    }
  };

  const handleArchiveClick = (noticeData: Notice) => {
    toggleArchive(noticeData);
    setIsArchived((prev) => !prev)
    if (isArchived) {
      toast.success("Notice unarchived successfully!");
    } else {
      toast.success("Notice archived successfully!");
    }
  };

  if (isLoading) {
    return (
      <div className="tw-max-w-2xl tw-mx-auto tw-text-primary">
        <div className="tw-flex tw-flex-col tw-items-center tw-p-6 tw-text-center tw-bg-primary tw-text-secondary">
          <div className="tw-flex tw-justify-center tw-items-center tw-mb-4">
            <div className="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-t-2 tw-border-b-2 tw-border-secondary" />
          </div>
          <Skeleton className="tw-h-8 tw-w-1/2 tw-mb-2" />
          <div className="tw-flex tw-items-center tw-justify-center tw-w-full">
            <div className="tw-flex tw-gap-3 tw-pr-3 tw-border-r tw-border-secondary/20 tw-items-center">
              <Skeleton className="tw-h-6 tw-w-20" />
              <Skeleton className="tw-h-6 tw-w-32" />
            </div>
            <div className="tw-flex tw-items-center tw-gap-3 tw-pl-3">
              <Skeleton className="tw-h-7 tw-w-7" />
            </div>
          </div>
        </div>
        <div className="tw-bg-gray-50 tw-p-6 tw-min-h-[120px]">
          <Skeleton className="tw-h-24 tw-w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-max-w-2xl tw-mx-auto tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-[60vh]">
        <p className="tw-text-red-500 tw-font-semibold tw-mb-2">
          {t("error", "Failed to load notice details.")}
        </p>
      </div>
    );
  }

  const noticeData = data?.data;

  return (
    <div className="tw-max-w-2xl tw-mx-auto tw-text-primary">
      <div className="tw-flex tw-flex-col tw-items-center tw-p-6 tw-text-center tw-bg-primary tw-text-secondary">
        <h1 className="tw-text-xl tw-font-bold tw-mb-2">{noticeData?.subject || t("noSubject", "No Subject")}</h1>
        <div className="tw-flex tw-items-center tw-justify-center tw-w-full">
          <div className="tw-flex tw-gap-3 tw-pr-3 tw-border-r tw-border-secondary/20 tw-items-center">
            <Badge className="tw-bg-secondary/10 tw-text-secondary tw-text-xs">{noticeData?.student_first_name || studentId}</Badge>
            <span className="tw-flex tw-items-center tw-gap-1 tw-text-secondary/70 tw-text-sm">
              <CalendarDays className="tw-w-4 tw-h-4" />
              {noticeData?.creation
                ? formatDate(new Date(noticeData.creation).toLocaleDateString())
                : ""}
            </span>
          </div>
          <div className="tw-flex tw-items-center tw-gap-3 tw-pl-3">
            <button
              className={`tw-text-secondary/70 tw-text-sm ${isStarring ? 'tw-opacity-50 tw-pointer-events-none' : ''}`}
              onClick={() => handleStarClick(noticeData)}
              disabled={isStarring}
            >
              <Star
                size={28}
                className={isStarred ? 'tw-fill-secondary tw-text-secondary/70' : ''}
              />
            </button>
            <button
              className={`tw-text-secondary/70 tw-text-sm ${isArchiving ? 'tw-opacity-50 tw-pointer-events-none' : ''}`}
              onClick={() => handleArchiveClick(noticeData)}
              disabled={isArchiving}
            >
              <Archive
                size={28}
                className={isArchived ? 'tw-fill-secondary tw-text-secondary/70' : ''}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="tw-bg-gray-50 tw-p-6 tw-min-h-[120px]">
        <NoticeShadowContent html={noticeData?.notice || ""} />
      </div>
    </div>
  );
}

export default DetailedNotices;