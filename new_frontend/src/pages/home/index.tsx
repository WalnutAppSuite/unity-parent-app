import { motion } from "framer-motion";
import pencil from "../../../public/images/57558fc7d7ca03a8dac4c1f84e489c69.png";
import student from "../../../public/images/ab30fa66a226dda26c05b92b28df05d0.png";
// import WalmikiLogo from "../../components/walmikiLogo";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

function Home() {

    const navigate = useNavigate()
    const { t } = useTranslation("home");

    return (
        <motion.div
            initial={{ opacity: 0, x: -1000 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 1000 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="tw-w-full tw-h-screen tw-bg-custom-gradient tw-text-white tw-flex tw-flex-col tw-p-4"
        >
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full">
                <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-8">
                    {/* Calendar Icon */}
                    <div className="tw-relative tw-bg-[#1A1150] tw-rounded-3xl tw-p-6 tw-aspect-square">
                        <img
                            src="/calendar-icon.png"
                            alt="Calendar"
                            className="tw-w-12 tw-h-12"
                        />
                    </div>

                    {/* Student Image */}
                    <div className="tw-relative">
                        <div className="tw-bg-white tw-rounded-full tw-aspect-square tw-overflow-hidden">
                            <img
                                src={student}
                                alt="Student"
                                className="tw-w-full tw-h-full tw-object-cover tw-scale-x-[-1]"
                            />
                        </div>
                    </div>

                    {/* Pencils Image */}
                    <div className="tw-relative tw-rounded-full tw-overflow-hidden tw-aspect-square">
                        <img
                            src={pencil}
                            alt="Pencils"
                            className="tw-w-full tw-h-full tw-object-cover"
                        />
                    </div>

                    {/* Abstract Shape */}
                    <div className="tw-relative">
                        <div className="tw-bg-white tw-h-12 tw-rounded-t-full"></div>
                        <div className="tw-bg-[#FFB800] tw-h-12 tw-rounded-b-full"></div>
                    </div>
                </div>
                <div className="tw-flex tw-flex-col tw-items-start tw-justify-start tw-gap-4">
                    {/* <WalmikiLogo /> */}
                    <span className="tw-text-5xl tw-font-grotesk">{t("welcome")}</span>
                    <Button onClick={() => { navigate('/login') }} className="tw-bg-white tw-w-full tw-font-medium tw-text-black tw-px-4 tw-py-3 tw-rounded-md">{t("sign_in")}</Button>
                </div>
            </div>
        </motion.div>
    )
}

export default Home;