import React from "react";

const Modal = ({ show, children }: any) => {

    return (
        <React.Fragment>
            {show && (
                <React.Fragment>
                    <div className="justify-center items-center flex overflow-hidden fixed inset-0 outline-none focus:outline-none" style={{zIndex:199}}>
                        <div className="relative w-auto my-6 mx-auto max-w-5xl inline-grid place-items-center h-full">
                            {/*content*/}
                            {children}
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}
export default Modal;