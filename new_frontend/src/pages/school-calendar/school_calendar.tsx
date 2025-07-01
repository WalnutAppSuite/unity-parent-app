import { useLocation } from "react-router-dom";

function school_calendar() {

    const location = useLocation();
    const { school } = location.state || '';

    let link = "";
    if (school?.includes?.("Shivane"))
        link = "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&bgcolor=%23ffffff&showPrint=0&showTabs=0&mode=MONTH&showTz=0&src=d2FsbnV0ZWR1LmluX25kanM1c2Jidm1ldDdwcWw1dW8wZDdvZDdrQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%233F51B5";
    if (school?.includes?.("Fursungi"))
        link = "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&bgcolor=%23ffffff&showPrint=0&showTabs=0&mode=MONTH&showTz=0&src=d2FsbnV0ZWR1LmluXzY5YjY4aWhvcnNxYXMybDZmazhzb2s2N2JvQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23009688";
    if (school?.includes?.("Wakad"))
        link = "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&bgcolor=%23ffffff&showPrint=0&showTabs=0&mode=MONTH&showTz=0&src=Y19hODkxZ2ExbXVxaW5oNWpqYWwwb24xNGhzMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23AD1457";

    return (
        <div style={{}}>
            <iframe
                title="School Calendar"
                src={link}
                style={{
                    border: 0,
                    height: "calc(100vh - 3.5rem)",
                    width: "100%",
                }}
                frameBorder="0"
                scrolling="no"
            ></iframe>
        </div>
    )
}

export default school_calendar;