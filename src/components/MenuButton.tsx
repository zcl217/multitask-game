import { motion } from "framer-motion";
import { BUTTON_BORDER_VARIANT, BUTTON_CONTENT_VARIANT, MENU_BUTTON_OPACITY_VARIANT, MODAL_CONTENT_VARIANT } from "../constants/animations/MenuAnimations";

interface MenuButtonProps {
    isButtonOpen: boolean,
    toggleButtonOpen: () => void,
    buttonName: string,
    positionFromTop: string,
    content: React.ReactNode,
}

const MenuButton: React.FC<MenuButtonProps> = (props) => {
    const { isButtonOpen, toggleButtonOpen, buttonName, positionFromTop, content } = props;

    const buttonClosedStyles = `top-[${positionFromTop}] fixed top-cursor-pointer menu-button-container-hover`;
    const handleMenuOpen = () => {
        if (!isButtonOpen) toggleButtonOpen();
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
            <motion.button
                className={`menu-button ${isButtonOpen ? 'absolute pointer-events-none' : 'menu-button-offset'}`}
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
                        className="pointer-events-auto"
                        variants={MODAL_CONTENT_VARIANT}
                        animate={isButtonOpen ? "open" : "closed"}
                        onClick={() => toggleButtonOpen()}
                        initial={false}
                    >
                        {content}
                        <div> close </div>
                    </motion.div>
                }
            </motion.button>
        </motion.div>
    )
}

export default MenuButton;