import { motion } from "framer-motion";
import { INSTRUCTIONS_ANIMATION } from "../constants/animations/CommonAnimations";

interface InstructionsProps {
    mainText: string,
    controlKeys: string[],
    controlKeyText?: string[],
    isLargeScreen?: boolean
}
// TODO: the styling for this component doesn't really work
// for small screens right now. fix.
const Instructions: React.FC<InstructionsProps> = (props) => {
    const { mainText, controlKeys, controlKeyText, isLargeScreen } = props;

    // don't overuse useMemo/useCallback. in this case it's more efficient to not use useMemo
    const controlList = () => {
        const controlList = [];
        for (let a = 0; a < controlKeys.length; a++) {
            if (controlKeyText) {
                controlList.push(<div className="flex flex-row" key={controlKeys[a]}>
                    <span className="flex items-center justify-center p-2 pb-3 mx-2 text-black bg-white border-2 border-black rounded-md control-key"> {controlKeys[a]} </span>
                    <span className=""> {controlKeyText[a]} {a < controlKeys.length - 1 && '|'} </span>
                </div>);
            } else {
                controlList.push(<div key={controlKeys[a]}>
                    <span className="flex items-center justify-center p-2 pb-3 mx-2 text-black bg-white border-2 border-black rounded-md control-key"> {controlKeys[a]} </span>
                </div>);
            }
        }
        return controlList;
    };

    return (
        <div className="absolute top-0 flex justify-center w-full h-1/4">
            <motion.div
                className="z-30 flex flex-col items-center justify-around w-full overflow-auto bg-white shadow-xl"
                animate={INSTRUCTIONS_ANIMATION}
            >
                <h1 className={`w-4/5 text-center ${isLargeScreen ? 'text-[3vw]' : 'text-[2vw]'}`}> {mainText} </h1>
                <div className="flex flex-col items-center w-full">
                    <div className="flex font-size-[2vw] test">
                        {controlList()}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Instructions;
