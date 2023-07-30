const reader = new FileReader();

export const handleFileRead = (file: File | any) => {
    return new Promise((resolve, reject) => {
        reader.onload = (event: any) => {
            const fileData = {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                lastModifiedDate: file?.lastModifiedDate,
                // content: event.target.result,
            };
            resolve(fileData);
        };
        reader.onerror = (event: any) => {
            reject(event.target.error);
        };
        reader.readAsDataURL(file);
    });
};