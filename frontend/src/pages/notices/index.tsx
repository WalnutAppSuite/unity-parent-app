import { IResourceComponentsProps } from "@refinedev/core";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Box, Button, Input, Stack, Text, Skeleton } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconArchive, IconCalendar, IconSearch, IconStar } from "@tabler/icons";
import useStudentList from "../../components/queries/useStudentList.ts";
import { getStudentProfileColor } from "../../components/hooks/useStudentProfileColor.ts";
import useMarkAsStared from "../../components/queries/useMarkStarMutation.ts";
import useMarkAsArchived from "../../components/queries/useMarkArchivedMutation.ts";
import useNoticeList from "../../components/queries/useNoticeList.ts";

interface StaredNoticeListProps extends IResourceComponentsProps {
  staredOnly?: boolean;
  archivedOnly?: boolean;
}

export const NoticeList: React.FC<StaredNoticeListProps> = ({
  staredOnly,
  archivedOnly,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { data } = useStudentList();
  const { mutateAsync: markAsStared } = useMarkAsStared();
  const { mutateAsync: markAsArchived } = useMarkAsArchived();
  const loadMoreRef = useRef(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const {
    data: list,
    isLoading,
    remove,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingList,
  } = useNoticeList({
    staredOnly,
    archivedOnly,
    search_query: isSearchActive ? searchQuery : "",
    limit: 10,
  });

  const filteredList = useMemo(() => {
    if (!list?.pages) return [];
    return list.pages.flatMap(page => page.message.notices || []);
  }, [list]);

  const debouncedRefetch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      refetch();
    }, 500); // 500ms debounce delay
  }, [refetch]);

  const handleSearch = () => {
    setIsSearchActive(!!searchQuery);
    refetch();
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value) {
      setIsSearchActive(false);
      debouncedRefetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isLoading) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isLoading, fetchNextPage]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const LoadingSkeleton = () => (
    <Stack spacing="md" p={2}>
      {[1, 2, 3].map((index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: "white",
            marginBottom: 10,
            border: "1px solid rgba(0,0,0,0.05)",
            padding: 5,
            flexDirection: "row",
            display: "flex",
            alignItems: "flex-start",
            gap: 5,
          }}
        >
          <Box p={5} sx={{ width: "calc(100% - 50px)", flexShrink: 0 }}>
            <Skeleton height={24} width="60%" radius="sm" mb={10} />
            <Skeleton height={80} radius="sm" mb={10} />
            <Stack spacing="xs">
              <Skeleton height={20} width="40%" radius="sm" />
              <Skeleton height={20} width="30%" radius="sm" />
            </Stack>
          </Box>
          <Box sx={{ padding: 5, paddingRight: 10 }}>
            <Skeleton height={30} width={30} radius="sm" mb={10} />
            <Skeleton height={30} width={30} radius="sm" />
          </Box>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box>
      <Box pb={10} pt={15} px={5} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 5, position: "relative" }}>
        <Input
          mx={5}
          style={{ flex: 1 }}
          onChange={handleSearchInputChange}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          aria-label="Search notices"
          value={searchQuery}
          placeholder="Search... (Press Enter to search)"
        />
        <Button variant="subtle" style={{ position: "absolute", right: 15, padding: 0, margin: 0 }} onClick={handleSearch}>
          <IconSearch style={{ color: "#666" }} />
        </Button>
      </Box>
      <Box p={2}>
        {isLoadingList ? (
          <LoadingSkeleton />
        ) : !filteredList?.length ? (
          <Text align="center" color="dimmed" weight="bold" my={30}>
            No Notice Found
          </Text>
        ) : (
          filteredList?.map?.((item) => (
            <Stack
              key={item.name + String(item.student || "")}
              sx={{
                backgroundColor: item.is_read ? "#F6FAFF" : "white",
                marginBottom: 10,
                border: "1px solid rgba(0,0,0,0.05)",
                padding: 5,
                flexDirection: "row",
                display: "flex",
                alignItems: "flex-start",
                gap: 5,
              }}
            >
              <Box
                p={5}
                sx={{
                  cursor: "pointer",
                  width: "calc(100% - 50px)",
                  flexShrink: 0,
                  ":hover": {
                    backgroundColor: "rgba(0,0,0,0.02)",
                  },
                }}
                onClick={() => {
                  if (!item.is_read) {
                    remove();
                    refetch().then(undefined);
                  }
                  navigate(
                    `/notice/${item.name}?student=${encodeURIComponent(
                      item.student
                    )}`
                  );
                }}
              >
                <Text
                  mih={20}
                  weight="bold"
                  size="lg"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                    // fontSize: 15,
                  }}
                >
                  {item.subject || "-"}
                </Text>
                <Box
                  my={5}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "none",
                    whiteSpace: "nowrap",
                    width: "100%",
                    fontSize: 14,
                    height: "5em",
                    pointerEvents: "none",
                    // borderRadius: '5px',
                    // color: '#888',
                  }}
                >
                  <Box
                    my={5}
                    className={!item.is_raw_html ? "ql-editor" : ""}
                    ref={(el) => {
                      if (el) {
                        // Only create shadow DOM if it doesn't exist
                        if (!el.shadowRoot) {
                          const shadowRoot = el.attachShadow({ mode: "open" });
                          shadowRoot.innerHTML = item.notice || "";
                        } else {
                          // Update existing shadow root content
                          el.shadowRoot.innerHTML = item.notice || "";
                        }
                      }
                    }}
                  />
                </Box>

                <Stack
                  h={35}
                  sx={{
                    flexDirection: "row",
                    // justifyContent: 'space-between',
                    paddingTop: 5,
                    paddingBottom: 5,
                    borderTop: "1px solid #eee",
                    gap: 10,
                    color: "#666",
                  }}
                >
                  <Stack
                    align="center"
                    justify="center"
                    mt={4}
                    px={10}
                    sx={{
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      fontSize: 13,
                      backgroundColor: getStudentProfileColor(
                        item.student,
                        data?.data?.message || []
                      ),
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: 3,
                    }}
                  >
                    {item?.student_first_name}
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
                      {new Date(item.creation)
                        .toLocaleDateString()
                        ?.replace(/\//g, "-") || "-"}
                    </span>
                  </Stack>
                </Stack>
              </Box>
              <Box
                sx={{
                  padding: 5,
                  paddingRight: 10,
                }}
              >
                <IconStar
                  style={{
                    marginBottom: 10,
                  }}
                  size={30}
                  fill={
                    item.is_stared
                      ? getStudentProfileColor(
                        item.student,
                        data?.data?.message || []
                      )
                      : "white"
                  }
                  color={getStudentProfileColor(
                    item.student,
                    data?.data?.message || []
                  )}
                  stroke={1}
                  onClick={() => {
                    console.log("item index", item);
                    markAsStared({
                      notice: item.name,
                      student: item.student,
                      stared: !item.is_stared,
                    }).then(() => refetch());
                  }}
                />

                <IconArchive
                  size={30}
                  color={
                    item.is_archived
                      ? "white"
                      : getStudentProfileColor(
                        item.student,
                        data?.data?.message || []
                      )
                  }
                  stroke={1}
                  fill={
                    item.is_archived
                      ? getStudentProfileColor(
                        item.student,
                        data?.data?.message || []
                      )
                      : "white"
                  }
                  onClick={() => {
                    console.log("delete index", item);

                    markAsArchived({
                      notice: item.name,
                      student: item.student,
                      archived: !item.is_archived,
                    }).then(() => refetch());
                  }}
                />
              </Box>
            </Stack>
          ))
        )}
        <div ref={loadMoreRef} style={{ height: "20px" }} />
      </Box>
    </Box>
  );
};
