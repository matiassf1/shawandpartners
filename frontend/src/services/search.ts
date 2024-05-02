import { API_HOST } from "../config";
import { ApiUploadResponse, Person } from "../interfaces";

export const searchData = async (search: string): Promise<[Error | null, Person[]?]> => {
    try {
        const res = await fetch(`${API_HOST}/api/users?q=${search}`);

        if (!res.ok) return [new Error(`Error searching data: ${res.statusText}`)]
        const { data }: ApiUploadResponse = await res.json();

        return [null, data];

    } catch (error) {
        if (error instanceof Error) return [error]
    }

    return [new Error('Unknown error')]
}