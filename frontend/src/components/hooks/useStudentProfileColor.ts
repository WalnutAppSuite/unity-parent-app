import useStudentList, { Student } from "../queries/useStudentList.ts";

const profileColors = ["#6D3BEA", "#F27841", "#fe7f00", "#ED1651"];
const iconsColors = ["#005E5F"];

export const getStudentProfileColor = (
  student_id: string | null,
  students: Student[]
) => {
  const idx = Math.max(
    students?.findIndex((student) => student.name === student_id) || -1,
    0
  );
  return profileColors[idx % profileColors.length];
};
export const getStudentIconColor = (
  student_id: string,
  students: Student[]
) => {
  const idx = Math.max(
    students?.findIndex((student) => student.name === student_id) || -1,
    0
  );
  return iconsColors[idx % iconsColors.length];
};

const useStudentProfileColor = (student_id: string | null) => {
  const { data } = useStudentList();
  return getStudentProfileColor(student_id, data?.data?.message || []);
};

export default useStudentProfileColor;
