import { useGetIdentity, useOne, useNotification } from "@refinedev/core";
import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Stack, Text } from "@mantine/core";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { IconCalendar, IconDownload } from "@tabler/icons";
import { Notice } from "../../components/queries/useNoticeList.ts";
import { IconStar, IconArchive } from "@tabler/icons";
import { PDFViewer } from "../../components/PDFViewer.tsx";
import { getStudentIconColor } from "../../components/hooks/useStudentProfileColor.ts";
import useMarkAsArchived from "../../components/queries/useMarkArchivedMutation.ts";
import useMarkAsStared from "../../components/queries/useMarkStarMutation.ts";
import useStudentList from "../../components/queries/useStudentList.ts";
import OtpComponent from "../confirmation/index.tsx";
import useRequestOtp from "../../components/queries/useNoticeRequestOtp.ts";
import html2pdf from "html2pdf.js";
import { useNavigation } from "../../context/navigation";

export const NoticeDetails: React.FC = () => {
  const params = useParams();
  const [queries] = useSearchParams();
  const navigate = useNavigate();
  const { setIsMenuEnabled, setIsBackButtonEnabled } = useNavigation();
  const { open } = useNotification();

  const noticeId = params?.id || "";
  const studentId = queries?.get("student") || "";
  const { mutateAsync: markAsStared } = useMarkAsStared();
  const { mutateAsync: markAsArchived } = useMarkAsArchived();
  const { data: identity } = useGetIdentity();
  const { data: studentsList } = useStudentList({ enabled: !!identity });

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data,
    isLoading,
    refetch: refetchNotice,
  } = useOne<Notice>({
    id: params?.id || "",
    queryOptions: {
      queryKey: ["details", "notices", params?.id, queries?.get("student")],
    },
  });

  // Refetch notice data when component mounts or URL parameters change
  useEffect(() => {
    refetchNotice();
  }, [noticeId, studentId, refetchNotice]);

  useEffect(() => {
    if (
      data?.data?.is_mandatory_notice &&
      data?.data?.approval_status === "Pending"
    ) {
      open?.({
        type: "success",
        message: "Mandatory Notice",
        description: "You must respond to this notice to access other options.",
      });
    }
  }, [open, data?.data?.is_mandatory_notice, data?.data?.approval_status]);

  const [openDialog, setOpenDialog] = useState(false);
  const [approval, setApproval] = useState(false);

  const { mutateAsync: requestOtp } = useRequestOtp();

  const handleOtpRequest = async () => {
    try {
      await requestOtp({ id: noticeId, student: studentId });
      setOpenDialog(true);
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setOpenDialog(false);
    }
  };

  const downloadContent = () => {
    const pageContent = document.createElement("div");

    // Create header section
    const header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.marginBottom = "20px";
    header.innerHTML = `
      <h2 style="color: #E2DF8A; margin-bottom: 10px;">${
        data?.data?.subject || "-"
      }</h2>
      <div style="color: #666; font-size: 13px;">
        ${data?.data?.student_first_name} | ${
      new Date(data?.data.creation).toLocaleDateString()?.replace(/\//g, "-") ||
      "-"
    }
      </div>
    `;

    // Add notice content
    const content = document.createElement("div");
    content.innerHTML = data?.data?.notice || "";

    // Combine sections
    pageContent.appendChild(header);
    pageContent.appendChild(content);

    const opt = {
      margin: 0.5,
      filename: `${data?.data?.subject || "notice"}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.clientWidth,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
    };

    html2pdf().set(opt).from(pageContent).save();
  };
  const handleDialogOpen = (value: boolean) => {
    setApproval(value);
    handleOtpRequest();
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  if (isLoading)
    return (
      <Text align="center" color="dimmed" weight="bold" my={30}>
        Loading...
      </Text>
    );
  return (
    <>
      <Box
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",

          overflow: "hidden",
        }}
      >
        <Box style={{ width: "100%" }}>
          <Box
            sx={{
              backgroundColor: "#E2DF8A",
              color: "white",
              padding: 10,
            }}
          >
            <Flex justify="space-between" align="center">
              <Text
                weight="bold"
                size="lg"
                c="#005E5F"
                sx={{
                  width: "100%",
                  padding: "5px 0",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {data?.data?.subject || "-"}
              </Text>
              {!data?.data?.is_pdf && (
                <Button
                  variant="subtle"
                  color="#005E5F"
                  onClick={downloadContent}
                  sx={{ flexShrink: 0 }}
                >
                  <IconDownload size={20} />
                </Button>
              )}
            </Flex>
            <Stack
              h={35}
              sx={{
                flexDirection: "row",
                paddingTop: 5,
                paddingBottom: 5,
                borderTop: "1px solid #eee",
                gap: 10,
                color: "#005E5F",
                justifyContent: "center",
              }}
            >
              <Stack
                align="center"
                justify="center"
                pt={4}
                pr={10}
                sx={{
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  fontSize: 13,
                  borderRight: "1px solid #eee",
                }}
              >
                {data?.data?.student_first_name}
              </Stack>

              <Stack
                align="center"
                justify="center"
                py={4}
                sx={{
                  display: "inline-flex",
                  flexDirection: "row",
                  whiteSpace: "nowrap",
                  fontSize: 13,
                  gap: 5,
                }}
              >
                <IconCalendar size={15} />
                <span style={{ paddingTop: 5 }}>
                  {new Date(data?.data.creation)
                    .toLocaleDateString()
                    ?.replace(/\//g, "-") || "-"}
                </span>

                {identity ? (
                  <>
                    <IconStar
                      style={{
                        marginTop: 5,
                        position: "absolute",
                        right: 45,
                        borderRight: "1px solid #eee",
                        paddingRight: "5px",
                      }}
                      size={35}
                      fill={
                        data?.data?.is_stared
                          ? getStudentIconColor(
                              studentId,
                              studentsList?.data?.message || []
                            )
                          : "white"
                      }
                      color={getStudentIconColor(
                        studentId,
                        studentsList?.data?.message || []
                      )}
                      stroke={1}
                      onClick={async () => {
                        try {
                          await markAsStared({
                            notice: noticeId,
                            student: studentId,
                            stared: !data?.data?.is_stared,
                          });

                          await refetchNotice();
                        } catch (error) {
                          console.error("Error marking as Stared:", error);
                        }
                      }}
                    />
                    <IconArchive
                      style={{
                        marginTop: 5,
                        position: "absolute",
                        right: 8,
                      }}
                      size={30}
                      color={
                        data?.data?.is_archived
                          ? "white"
                          : getStudentIconColor(
                              studentId,
                              studentsList?.data?.message || []
                            )
                      }
                      stroke={1}
                      fill={
                        data?.data?.is_archived
                          ? getStudentIconColor(
                              studentId,
                              studentsList?.data?.message || []
                            )
                          : "white"
                      }
                      onClick={async () => {
                        try {
                          if (data?.data?.is_mandatory_notice) {
                            // Don't allow archiving mandatory notices
                            return;
                          }
                          await markAsArchived({
                            notice: noticeId,
                            student: studentId,
                            archived: !data?.data?.is_archived,
                          });
                          await refetchNotice();
                          navigate("/");
                        } catch (error) {
                          console.error("Error marking as archived:", error);
                        }
                      }}
                    />
                  </>
                ) : null}
              </Stack>
            </Stack>
          </Box>
          <Box
            sx={{
              overflow: "auto",
              width: "100%",
              padding: 10,
            }}
          >
            {data?.data?.is_pdf ? (
              <PDFViewer
                url={data.data.pdf}
                width={width > 700 ? 700 : width}
                filename={`${data.data.subject || "notice"}.pdf`}
              />
            ) : !data?.data?.pdf && data?.data?.is_raw_html ? (
              <>
                <Box
                  ref={(el) => {
                    if (el) {
                      if (!el.shadowRoot) {
                        const shadowRoot = el.attachShadow({ mode: "open" });
                        shadowRoot.innerHTML = data?.data?.notice || "";
                      } else {
                        el.shadowRoot.innerHTML = data?.data?.notice || "";
                      }
                    }
                  }}
                />
              </>
            ) : (
              <>
                <link
                  href="https://cdn.jsdelivr.net/npm/quill@2.0.0-beta.0/dist/quill.snow.css"
                  rel="stylesheet"
                />
                <link
                  href="https://cdn.jsdelivr.net/npm/quill@2.0.0-beta.0/dist/quill.bubble.css"
                  rel="stylesheet"
                />
                <>
                  <Box
                    className="ql-editor"
                    ref={(el) => {
                      if (el) {
                        if (!el.shadowRoot) {
                          const shadowRoot = el.attachShadow({ mode: "open" });
                          shadowRoot.innerHTML = data?.data?.notice || "";
                        } else {
                          el.shadowRoot.innerHTML = data?.data?.notice || "";
                        }
                      }
                    }}
                  />
                </>
              </>
            )}
          </Box>
        </Box>
        {identity
          ? data?.data?.requires_approval === 1 &&
            data?.data?.approval_status === "Pending" && (
              <Flex mt="md" mb="xl" style={{ display: "flex", gap: "48px" }}>
                <Button
                  size="md"
                  radius="md"
                  color="#D97706"
                  sx={{
                    backgroundColor: "#D97706",
                    "&:hover": {
                      backgroundColor: "#B45309",
                    },
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontWeight: 600,
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => handleDialogOpen(true)}
                >
                  {data?.data?.approve_button_text || "Accept"}
                </Button>

                <Button
                  size="md"
                  radius="md"
                  color="#57534E"
                  sx={{
                    backgroundColor: "#57534E",
                    "&:hover": {
                      backgroundColor: "#44403C",
                    },
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontWeight: 600,
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => handleDialogOpen(false)}
                >
                  {data?.data?.reject_button_text || "Reject"}
                </Button>
              </Flex>
            )
          : null}
      </Box>

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          transform: openDialog ? "translateY(-5%)" : "translateY(100%)",
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {openDialog && (
          <OtpComponent
            onClose={handleClose}
            approve={approval}
            studentId={studentId}
            noticeId={noticeId}
            setIsBackButtonEnabled={setIsBackButtonEnabled}
            setIsMenuEnabled={setIsMenuEnabled}
            onSuccess={refetchNotice}
          />
        )}
      </div>
    </>
  );
};
