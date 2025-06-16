import { useParams, useSearchParams } from 'react-router-dom';

function DetailedNotices() {

    const { noticeId } = useParams<{ noticeId: string }>();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId') || '';

  return (
    <div>
        <h1>Notice Details</h1>
        <p>Notice ID: {noticeId}</p>
        <p>Student ID: {studentId}</p>
        {/* Additional details can be added here */}
        <p>This page will display detailed information about the notice.</p>
    </div>
  )
}

export default DetailedNotices