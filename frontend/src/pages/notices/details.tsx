import { useOne } from "@refinedev/core";
import React from "react";
import { Box, Stack, Text } from "@mantine/core";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IconCalendar } from "@tabler/icons";
import { Notice } from "../../components/queries/useNoticeList.ts";
import { IconArchive, IconStar } from "@tabler/icons";
import { getStudentIconColor } from "../../components/hooks/useStudentProfileColor.ts";
import useMarkAsArchived from "../../components/queries/useMarkArchivedMutation.ts";
import useMarkAsStared from "../../components/queries/useMarkStarMutation.ts";
import useStudentList from "../../components/queries/useStudentList.ts";
export const NoticeDetails: React.FC = () => {
  const params = useParams();
  const [queries] = useSearchParams();

  const noticeId = params?.id ?? "";
  const studentId = queries?.get("student") ?? "";
  const navigate = useNavigate();
  const { mutateAsync: markAsStared } = useMarkAsStared();
  const { mutateAsync: markAsArchived } = useMarkAsArchived();
  const { data: studentsList } = useStudentList();
  // const { refetch, data: list } = useNoticeList({
  //   archivedOnly: true,

  // });
  // const { data: listStared, refetch: starRefetch } = useNoticeList({
  //   staredOnly: true,

  // });

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

  // const listItem = list?.data?.message?.find((i) => params?.id && i.name === params.id);
  // const listStar = listStared?.data?.message?.find((i) => params?.id && i.name === params.id);

  if (isLoading)
    return (
      <Text align="center" color="dimmed" weight="bold" my={30}>
        Loading...
      </Text>
    );
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#422e1a",
          color: "white",
          padding: 10,
        }}
      >
        <Text
          weight="bold"
          size="lg"
          sx={{
            width: "100%",
            padding: "5px 0",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {data?.data?.subject || "-"}
        </Text>
        <Stack
          h={35}
          sx={{
            flexDirection: "row",
            // justifyContent: 'space-between',
            paddingTop: 5,
            paddingBottom: 5,
            borderTop: "1px solid #eee",
            gap: 10,
            color: "#fdc426",
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
              // justifyContent: 'center',
              flexDirection: "row",
              // alignItems: 'center',
              // borderRadius: 5,
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
        {data?.data?.is_raw_html ? (
          <>
            <>
              <Box
                ref={(el) => {
                  if (el) {
                    // Only create shadow DOM if it doesn't exist
                    if (!el.shadowRoot) {
                      const shadowRoot = el.attachShadow({ mode: "open" });
                      shadowRoot.innerHTML = data?.data?.notice || "";
                    } else {
                      // Update existing shadow root content
                      el.shadowRoot.innerHTML = data?.data?.notice || "";
                    }
                  }
                }}
              />
            </>
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
                    // Only create shadow DOM if it doesn't exist
                    if (!el.shadowRoot) {
                      const shadowRoot = el.attachShadow({ mode: "open" });
                      shadowRoot.innerHTML = data?.data?.notice || "";
                    } else {
                      // Update existing shadow root content
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
  );
};
