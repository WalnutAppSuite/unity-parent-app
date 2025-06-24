import { usePTMLinks } from "@/hooks/usePTMLinksQuery";
import OnlinePtmLinkCard from '@/components/custom/ptm-card/index'
import { useLocation } from "react-router-dom";

function OfflinePtm() {
    const location = useLocation();
    const { studentId, studentName } = location.state;

    return (
        <div>
            {studentName} - {studentId}
        </div>
    )
}

export default OfflinePtm;