import { useLocation } from "react-router-dom";

function DetailedEvent() {

    const location = useLocation();
    const { studentId, firstName } = location.state;

    console.log(studentId, firstName);

    return (
        <div className="tw-flex tw-flex-col tw-gap-4 tw-p-4 tw-text-primary">
            <h1 className="tw-font-semibold tw-text-lg">{firstName}</h1>
            
        </div>
    )
}

export default DetailedEvent;