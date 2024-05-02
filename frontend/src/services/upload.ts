import { API_HOST } from "../config";
import { ApiUploadResponse, Person } from "../interfaces";

export const uploadFile = async (file: File): Promise<[Error | null, Person[]?]> => {
    const formData = new FormData();

    formData.append('file', file);

    try {
        const res = await fetch(`${API_HOST}/api/files`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) return [new Error(`Error uploading file: ${res.statusText}`)]
        const { data }: ApiUploadResponse = await res.json();

        return [null, data];

    } catch (error) {
        if (error instanceof Error) return [error]
    }

    return [new Error('Unknown error')]
}