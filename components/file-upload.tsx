"use client";

export const FileUpload = () => {
    return (
        <div>
            <input type="file" accept="image/*" className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
                Upload Image
            </label>
        </div>
    )
}
