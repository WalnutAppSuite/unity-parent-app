import { useLocation } from "react-router-dom";

function DetailedKnowledgeBase() {

    const location = useLocation();
    const { wiki_link } = location.state;

    if (!wiki_link) {
        return (
            <div className="tw-w-full tw-h-[80vh] tw-flex tw-items-center tw-justify-center">
                <p className="tw-text-primary">No wiki link found</p>
            </div>
        );
    }

    return (
        <div className="tw-w-full tw-h-full">
            <iframe src={wiki_link} className="tw-w-full tw-h-full" />
        </div>
    )
}

export default DetailedKnowledgeBase;