export const BUTTON_BORDER_VARIANT = {
    open: {
        height: "90vh",
        width: "90vw",
        top: "3%",
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',

        // backgroundColor:"rgba(26, 147, 234, 0.8)",
        // backgroundColor: 'rgb(9, 203, 241)',
        transition: {
            duration: 0.5,
            // backgroundColor: {
            //     duration: 0.5
            // },
            clipPath: {
                duration: 0.3
            }
        }
    },
    closed: (custom: string) => ({
        top: custom,
        // backgroundColor: 'rgba(0, 0, 0, 0)',
        // backgroundColor: 'rgb(0, 0, 0)',
        clipPath: 'polygon(0% 20%, 10% 0%, 100% 0%, 100% 80%, 90% 100%, 0% 100%)',
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40,
            duration: 0.5,
            backgroundColor: {
                duration: 0.3
            },
            clipPath: {
                duration: 0.3
            },
            top: {
                duration: 0.1
            }
        }
    })
};

export const BUTTON_CONTENT_VARIANT = {
    open: {
        margin: "0px",
        height: "85vh",
        width: "85vw",
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',

        // backgroundColor:"rgba(26, 147, 234, 0.8)",
        // backgroundColor: 'rgb(9, 203, 241)',
        transition: {
            duration: 0.5,
            backgroundColor: {
                duration: 0.5
            },
            clipPath: {
                duration: 0.3
            }
        }
    },
    closed: {

        // backgroundColor: 'rgba(0, 0, 0, 0)',
        backgroundColor: 'rgb(0, 0, 0)',
        clipPath: 'polygon(0% 20%, 10% 0%, 100% 0%, 100% 80%, 90% 100%, 0% 100%)',
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40,
            duration: 0.5,
            backgroundColor: {
                duration: 0.3
            },
            clipPath: {
                duration: 0.3
            }
        }
    }
};

export const MODAL_CONTENT_VARIANT = {
    open: {
        opacity: 1,
        transition: {
            delay: 0.2,
            duration: 0.1
        }
    },
    closed: {
        opacity: 0,
        transition: {
            delay: 0.2,
            duration: 0.1
        }
    }
};

export const MENU_BUTTON_OPACITY_VARIANT = {
    open: {
        // opacity: 0,
        // transition: {
        //     duration: 0.01
        // }
        display: 'none'
    },
    closed: {
        opacity: 1,
        transition: {
            delay: 0.2,
            duration: 0.1
        }
    }
}

