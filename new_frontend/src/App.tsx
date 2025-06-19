import { BrowserRouter } from 'react-router-dom';
import WalshRoute from '@/pages/routes';
import { basePath } from '@/constants';
import { useStudents } from '@/hooks/useStudentList';
import { studentsAtom } from '@/store/studentAtoms';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

function App() {

  const { data: students } = useStudents();

  const setStudents = useSetAtom(studentsAtom)

  useEffect(() => {
    if (students) setStudents(students);
  }, [students, setStudents]);
  
  return (
    <BrowserRouter basename={basePath}>
      <WalshRoute />
    </BrowserRouter>
  );
}

export default App;
