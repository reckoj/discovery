import { MdOutlineCancel } from "react-icons/md";

const ImageViewer = ({ imageUrl, onClose }: any) => {
    return (
        <div className="absolute left-1/2 top-1/2 z-[250] translate-x-[-50%] translate-y-[-50%]">
            <div className="relative">
                <MdOutlineCancel className="absolute right-2 top-2 text-white cursor-pointer" onClick={onClose} />
                <img src={imageUrl} alt="Image" />
            </div>
        </div>
    );
};

export default ImageViewer;
