import { motion } from "framer-motion";
import { BUTTON_BORDER_VARIANT, BUTTON_CONTENT_VARIANT, MENU_BUTTON_OPACITY_VARIANT, MODAL_CONTENT_VARIANT } from "../constants/animations/MenuAnimations";

interface MenuButtonProps {
    isButtonOpen: boolean,
    handleButtonClick: () => void,
    buttonName: string,
    positionFromTop: string,
    content?: React.ReactNode,
}

const MenuButton: React.FC<MenuButtonProps> = (props) => {
    const { isButtonOpen, handleButtonClick, buttonName, positionFromTop, content } = props;

    const buttonClosedStyles = `top-[${positionFromTop}] fixed top-cursor-pointer menu-button-container-hover`;
    const handleMenuOpen = () => {
        if (!isButtonOpen) handleButtonClick();
    }
    /* see if this stops other menu buttons from shifting position */
    return (
        <motion.div
            className={`menu-button-container ${isButtonOpen ? 'absolute z-50' : buttonClosedStyles}`}
            custom={positionFromTop}
            variants={BUTTON_BORDER_VARIANT}
            animate={isButtonOpen ? "open" : "closed"}
            initial={false}
        >
            <motion.div
                className={`menu-button ${isButtonOpen ? 'absolute' : 'menu-button-offset cursor-pointer flex items-center justify-center'}`}
                variants={BUTTON_CONTENT_VARIANT}
                animate={isButtonOpen ? "open" : "closed"}
                onClick={() => handleMenuOpen()}
                initial={false}
            >
                <div className={`${isButtonOpen ? 'hidden' : 'block'}`}>
                    <span className="pointer-events-none"> {buttonName} </span>
                </div>
                {isButtonOpen &&
                    <motion.div
                        className="h-full opacity-0"
                        variants={MODAL_CONTENT_VARIANT}
                        animate={isButtonOpen ? "open" : "closed"}
                    >
                        <div className="relative flex flex-col justify-around h-full">
                            <button
                                className="absolute top-[2%] right-[2%] w-16 h-16 modal-content-button"
                                onClick={() => handleButtonClick()}
                            > X </button>
                            {content}
                        </div>
                    </motion.div>
                }
            </motion.div>
        </motion.div>
    )
}

export default MenuButton;