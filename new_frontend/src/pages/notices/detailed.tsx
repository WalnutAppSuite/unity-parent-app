import { useLocation, useNavigate } from "react-router-dom";
import useNoticeDetails from "@/hooks/useNoticeDetailed";
import { Badge } from "@/components/ui/badge";
import { Archive, CalendarDays, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useRef, useState } from "react";
import useNoticeActions from "@/hooks/useNoticeActions";
import type { Notice } from "@/types/notice";
import LoadingSpinner from "@/components/LoadingSpinner";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { notice, studentId , starred , archived } = location.state || {};
  const { t } = useTranslation("notices");
  const { toggleStar, toggleArchive, isStarring, isArchiving } = useNoticeActions();
  const { data, isLoading, error } = useNoticeDetails({ id: notice, student: studentId });
  const [isStarred, setIsStarred] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setIsStarred(starred || false);
      setIsArchived(archived || false);
      // Save to localStorage
      localStorage.setItem(`notice_${notice}_starred`, JSON.stringify(starred || false));
      localStorage.setItem(`notice_${notice}_archived`, JSON.stringify(archived || false));
    }
  }, [data, starred, archived, notice]);

  const handleStarClick = (noticeData: Notice) => {
    toggleStar(noticeData);
    setIsStarred((prev) => {
      localStorage.setItem(`notice_${notice}_starred`, JSON.stringify(!prev));
      return !prev;
    });
  };

  const handleArchiveClick = (noticeData: Notice) => {
    toggleArchive(noticeData);
    setIsArchived((prev) => {
      localStorage.setItem(`notice_${notice}_archived`, JSON.stringify(!prev));
      return !prev;
    });
  };

  if (isLoading) {
    return (
      <div className="tw-flex tw-w-full tw-items-center tw-justify-center tw-h-[calc(100vh-3.5rem)]">
        <div className="tw-w-1/2">
          <LoadingSpinner />
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
      <div className="tw-flex tw-flex-col tw-items-center tw-p-6 tw-text-left tw-bg-primary tw-text-secondary">
        <h1 className="tw-text-xl tw-font-bold tw-mb-2">{noticeData?.subject || t("noSubject", "No Subject")}</h1>
        <div className="tw-flex tw-items-center tw-justify-between tw-w-full">
          <div className="tw-flex tw-gap-3 tw-items-center">
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