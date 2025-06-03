import { useInfiniteQuery } from "@tanstack/react-query";

interface FileData {
  name: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  creation: string;
  modified: string;
  attached_to_doctype: string;
  attached_to_name: string;
  attached_to_field: string;
  is_private: number;
  thumbnail_url: string | null;
}

interface FileResponse {
  data: FileData[];
}

interface ProcessedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

const fetchStudentFiles = async (
  studentId: string,
  pageParam = 0,
  pageSize: number
): Promise<FileData[]> => {
  const filters = [
    ["attached_to_doctype", "=", "Student"],
    ["attached_to_name", "=", studentId],
  ] as const;

  const encodedFilters = encodeURIComponent(JSON.stringify(filters));
  const fields = encodeURIComponent(JSON.stringify(["*"]));
  const url = `/api/resource/File?filters=${encodedFilters}&fields=${fields}&limit_page_length=${pageSize}&limit_start=${pageParam}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch files");
  }

  const data: FileResponse = await response.json();
  return data.data;
};

export const useStudentDocs = (studentId: string, pageSize: number = 10) => {
  return useInfiniteQuery<FileData[], Error>({
    queryKey: ["studentFiles", studentId] as const,
    queryFn: ({ pageParam }) => fetchStudentFiles(studentId, pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length === pageSize ? allPages.length * pageSize : undefined,
    enabled: !!studentId,
  });
};

// Helper function to process file data
export const processFileData = (file: FileData): ProcessedFile => ({
  name: file.file_name,
  url: file.file_url,
  type: file.file_type,
  size: file.file_size,
});
