import { BrowserRouter } from 'react-router-dom';
import WalshRoute from '@/pages/routes';
import { basePath } from '@/constants';
import { useStudents } from '@/hooks/useStudentList';
import { studentsAtom } from '@/store/studentAtoms';
import { useSetAtom } from 'jotai';
import { useEffect, Suspense } from 'react';
import { Toaster } from 'sonner'

function App() {
  const { data: students, isLoading, error } = useStudents();
  const setStudents = useSetAtom(studentsAtom)

  useEffect(() => {
    if (students) setStudents(students);
  }, [students, setStudents]);
  
  if (isLoading) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen">
        <div className="tw-text-center">
          <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-b-2 tw-border-primary tw-mx-auto"></div>
          <p className="tw-mt-4 tw-text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen">
        <div className="tw-text-center">
          <p className="tw-text-red-500">Something went wrong while loading the application.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="tw-mt-4 tw-px-4 tw-py-2 tw-bg-primary tw-text-white tw-rounded tw-cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <Suspense fallback={
      <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen">
        <div className="tw-text-center">
          <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-b-2 tw-border-primary tw-mx-auto"></div>
          <p className="tw-mt-4 tw-text-primary">Loading...</p>
        </div>
      </div>
    }>
      <BrowserRouter basename={basePath}>
        <Toaster position='top-left' richColors/>
        <WalshRoute />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
