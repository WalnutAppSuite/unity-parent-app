import { useState } from 'react';
import { AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { studentsAtom } from "@/store/studentAtoms";
import type { Student } from '@/types/students';
import StudentAccordion from '@/components/custom/student-accordion';
import ActionPopup from '@/components/custom/popup-bars/ActionPopup'


function StudentProfile() {
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [pendingEditStudentId, setPendingEditStudentId] = useState<string | null>(null);

  const [students, setStudents] = useAtom(studentsAtom);


  const handleEditStart = (studentId: string) => {

    if (editingStudentId && editingStudentId !== studentId) {
      setPendingEditStudentId(studentId);
      setShowWarningPopup(true);
      return;
    }


    setEditingStudentId(studentId);
  };

  const handleEditAttempt = (studentId: string) => {

    if (editingStudentId && editingStudentId !== studentId) {
      setPendingEditStudentId(studentId);
      setShowWarningPopup(true);
    }
  };

  const handleStudentUpdate = (studentId: string, updatedData: Partial<Student>) => {

    setStudents(prev => prev.map(student =>
      student.id === studentId
        ? { ...student, ...updatedData }
        : student
    ));
  };

  const handleEditComplete = () => {

    setEditingStudentId(null);
  };


  const handleWarningPopupContinue = () => {
    setShowWarningPopup(false);


    if (pendingEditStudentId) {
      setEditingStudentId(pendingEditStudentId);
      setPendingEditStudentId(null);
    }
  };

  const handleWarningPopupCancel = () => {
    setShowWarningPopup(false);
    setPendingEditStudentId(null);
  };

  return (
    <div className='tw-flex tw-flex-col tw-gap-6'>

      {students.map((student: Student, index: number) => (
        <StudentAccordion
          key={student.id || student.reference_number || index}
          student={student}
          index={index}
          isEditing={editingStudentId === student.id}
          onEditStart={handleEditStart}
          onEditAttempt={handleEditAttempt}
          onStudentUpdate={handleStudentUpdate}
          onEditComplete={handleEditComplete}
        />
      ))}


      <AnimatePresence>
        <ActionPopup
          isVisible={showWarningPopup}
          onSave={handleWarningPopupContinue}
          onCancel={handleWarningPopupCancel}
          title="Switch Student"
          message="You are currently editing another student. Do you want to continue editing this student instead?"
          saveButtonText="Continue Editing"
          cancelButtonText="Stay Here"
        />
      </AnimatePresence>
    </div>
  );
}

export default StudentProfile;