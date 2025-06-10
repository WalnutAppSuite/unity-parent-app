import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
    onClose: () => void;
    setHeaderTitle: (title: string) => void;
}

const menuItems = [
    { title: "Login", path: "/login" },
    { title: "Home", path: "/" },
    { title: "Notice", path: "/notices" },
    { title: "Curriculum Updates", path: "/curriculum" },
    { title: "Absent Note", path: "/absent" },
    { title: "Early Pick up", path: "/pickup" },
    { title: "Events", path: "/events" },
    { title: "PTM Links", path: "/ptm" },
    { title: "Student Profile", path: "/profile" },
    { title: "Fee", path: "/fee" },
    { title: "Result", path: "/result" },
    { title: "School Calendar", path: "/calendar" },
    { title: "Starred Messages", path: "/starred" },
    { title: "Bonafide Certificate", path: "/certificate" },
    { title: "Helpdesk", path: "/helpdesk" },
];

const Navbar = ({ onClose, setHeaderTitle }: NavbarProps) => {
    const handleMenuItemClick = (title: string) => {
        setHeaderTitle(title);
        onClose();
    };

    const handleWindowReload = () => {
        window.location.reload();
    };

    const handleLogout = () => {
        console.log("Logout");
    };

    return (
        <div className="tw-w-full tw-h-screen tw-bg-[#07183C] tw-text-white tw-flex tw-flex-col">
            <div className="tw-p-6">
                <div className="tw-flex tw-items-center tw-justify-center tw-relative">
                    <button
                        onClick={onClose}
                        className="tw-p-2 tw-rounded-full tw-bg-white/10 tw-absolute tw-left-0"
                    >
                        <ChevronLeft size={30} className="tw-text-[#7E848D]" />
                    </button>
                    <span className="tw-text-xl">Menu</span>
                </div>
            </div>

            <nav className="tw-flex-1 tw-overflow-y-auto tw-px-6 tw-py-4">
                <ul className="tw-space-y-4">
                    {menuItems.map((item) => (
                        <li
                            key={item.path}
                            onClick={() => handleMenuItemClick(item.title)}
                            className="tw-border-b tw-border-white/10"
                        >
                            <Link
                                to={item.path}
                                className="tw-flex tw-items-center tw-justify-between tw-py-3"
                            >
                                <span className="tw-text-[15px]">{item.title}</span>
                                <ChevronRight size={18} className="tw-text-[#7E848D]" />
                            </Link>
                        </li>
                    ))}
                    <li className="tw-border-b tw-border-white/10">
                        <button
                            onClick={handleWindowReload}
                            className="tw-flex tw-w-full tw-items-center tw-justify-between tw-py-3"
                        >
                            <span className="tw-text-[15px]">Reload</span>
                            <ChevronRight size={18} className="tw-text-[#7E848D]" />
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="tw-flex tw-w-full tw-items-center tw-justify-between tw-py-3"
                        >
                            <span className="tw-text-[15px]">Logout</span>
                            <ChevronRight size={18} className="tw-text-[#7E848D]" />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar; 