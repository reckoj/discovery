export const fileSize = (sizeInBytes: number, type: string) => {
    const units: any = {
        bytes: 0,
        kb: 1,
        mb: 2,
        gb: 3,
        tb: 4
    };

    const bytes = Math.abs(sizeInBytes);
    const exp = Math.min(units[type.toLowerCase()], 4);

    const sizeInUnit = bytes / Math.pow(1024, exp);

    return parseFloat(sizeInUnit.toFixed(2));
};

export const formatFileSize = (size: number): string => {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];

    if (size === 0) {
        return '0 bytes';
    }

    const i = Math.floor(Math.log(size) / Math.log(1024));
    const formattedSize = (size / Math.pow(1024, i)).toFixed(2);

    return `${formattedSize} ${units[i]}`;
}

export const validTypes = ['image/jpeg', 'image/png'];