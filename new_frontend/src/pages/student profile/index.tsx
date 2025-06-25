import React from 'react';
import { studentsAtom } from "@/store/studentAtoms";
import { useAtom } from "jotai";
import type { Student } from "@/types/students";
import StudentAccordion from "./studentAccordion";

function StudentProfile() {
  const [students]: [Student[], any] = useAtom(studentsAtom);
    
 
   
  return (
  
      
      <div className="pb-6">  
        {students.map((student: Student, index: number) => (
          <StudentAccordion
            key={student.id || student.reference_number || index}
            student={student}
            index={index}
          />
        ))}
      </div>
    
  );
}

export default StudentProfile;