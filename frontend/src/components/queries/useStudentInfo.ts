const fetchStudentInfo = async (studentId: string) => {
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const url = `/api/resource/Student/${studentId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching student files:", error);
    throw error;
  }
};

export default fetchStudentInfo;
