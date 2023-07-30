import React, { useState } from "react";
import Spinner from "../Spinner";
import { fileSize, formatFileSize, validTypes } from "../../utils/size-check.utils";
import { toast } from "react-toastify";
import { toastUtil } from "../../utils/toast-utils";
import { FileType } from "../../enums/file-type.enum";
import { handleFileRead } from "../../utils/files.utils";
import { RiDeleteBinLine } from "react-icons/ri";

const FileUpload = ({ id, setFile, onRemoveAttahments }: any) => {
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile]: any = useState<File | null>();
    const [fileInfo, setFileInfo]: any = useState({ size: "" });
    const [loading, setLoading]: any = useState(false);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];

        if (validTypes.includes(file.type)) setFileInformation(file);
        else toast.warning("This file type is not supported", toastUtil);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: any = e.target.files?.[0];
        if (validTypes.includes(file.type)) setFileInformation(file);
        else toast.warning("This file type is not supported", toastUtil);
        e.target.value = "";
    };

    const setFileInformation = async (file: File) => {
        let size = fileSize(file.size, "mb");
        if (size > 10) {
            let message = `File size is too big (${size}MB) max file size is 2MB`
            return toast.warning(message, toastUtil);
        }
        const url = URL.createObjectURL(file);

        try {
            let type: string;
            setLoading(true);
            let FileInfo: any;

            if (file.type.includes("image")) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    type = FileType.IMAGE;
                    const img: any = new Image();
                    img.src = reader.result;
                    img.onload = () => {
                        const { size }: any = file;
                        FileInfo = {
                            size: formatFileSize(size),
                        };
                        doUploadUtil(file, FileInfo, url, FileType.IMAGE);
                    };
                };
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    type = FileType.PDF;
                    const { size }: any = file;
                    FileInfo = { size: formatFileSize(size) };
                    doUploadUtil(file, FileInfo, url, FileType.PDF);
                };
            }
            await handleFileRead(file);
        } catch (error: any) {
            return toast.error("Error occurred while uploading file", toastUtil);
        } finally {
        }
    };

    const doUploadUtil = (file: any, FileInfo: any, url: string, type: string) => {
        setFileInfo({ size: FileInfo?.size });
        toast.success("File Uploaded Successfully!", toastUtil)
        setFile(file, id);
        setSelectedFile({ file, url, type, id });

        let timer = setTimeout(() => {
            setLoading(false);
            clearTimeout(timer);
        }, 1000);
    }

    return (
        <React.Fragment>
            <div className={`border-2 border-dashed rounded-md h-[140px] select-none ${dragOver ? "border-cyan-800" : "border-neutral-300"}`}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                <label htmlFor={id}>
                    {selectedFile && selectedFile?.id === id ? (
                        <div className="flex items-center relative check-background h-full px-2">
                            <div className={`h-8 w-8 p-2 absolute top-2 rounded-full cursor-pointer bg-white right-2`} onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedFile(null);
                                onRemoveAttahments(id)
                            }}>
                                <RiDeleteBinLine />
                            </div>
                            <section className="h-[100px] w-[100px] bg-white inline-grid place-items-center shadow-cs-3 rounded-md overflow-hidden">
                                {(selectedFile?.type === FileType.IMAGE) ? <img src={selectedFile?.url} alt={selectedFile?.file?.name} className="w-[80%] h-[90%]" /> : <embed src={selectedFile?.url} type="application/pdf" className="w-[100%] h-[90%]" />}
                            </section>

                            <section className="px-3 h-[120px] inline-flex flex-col justify-between py-2">
                                <div>
                                    <h2 className="text-neutral-900 font-medium text-base truncate mb-3 max-w-[200px]">{selectedFile?.file?.name}</h2>
                                    <h4 className="text-neutral-700 font-medium text-sm truncate max-w-[200px]">{fileInfo?.size}</h4>
                                </div>
                            </section>
                        </div>
                    ) : (
                        loading ? (
                            <div className="inline-flex items-center align-center justify-center w-full h-full">
                                <Spinner />
                            </div>
                        ) : (
                            <div className="inline-flex items-center flex-col align-center justify-center w-full h-full cursor-pointer">
                                <p className="font-medium my-1">
                                    <small className="text-sm color-blue">Upload File</small>&nbsp;
                                    <small className="text-sm text-neutral-500">Or Drag & Drop</small>
                                </p>
                                <div className="text-neutral-500 text-sm font-normal">PNG, JPG up to 2MB</div>
                                <input id={id} accept=".jpg,.png" type="file" className="hidden" onChange={handleFileInput} />
                            </div>
                        )
                    )}
                </label>
            </div>
        </React.Fragment>
    );
};

export default FileUpload;