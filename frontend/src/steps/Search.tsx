import { useEffect, useState } from "react"
import { searchData } from "../services/search";
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { Person } from "../interfaces"

export const Search = ({ initialData }: { initialData: Person[] }) => {
    const [data, setData] = useState<Person[]>(initialData);
    const [search, setSearch] = useState(() => {
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    });

    const debounceSearch = useDebounce(search, 500);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    useEffect(() => {
        const newPathname = debounceSearch === ''
            ? window.location.pathname
            : `?q=${debounceSearch}`

        window.history.replaceState({}, '', newPathname);
    }, [debounceSearch]);

    useEffect(() => {
        if (!debounceSearch) {
            setData(initialData);
            return
        }
        searchData(debounceSearch).then(response => {
            const [err, newData] = response;
            if (err) {
                toast.error(err.message);
                return
            }

            if (newData) setData(newData)
        })
    }, [debounceSearch, initialData])

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Search</h1>
            <form>
                <input
                    onChange={handleSearch}
                    placeholder="Search info..."
                    type="search"
                    defaultValue={search}
                    className="border border-gray-300 rounded px-4 py-2 mb-4"
                    data-test="input-search"
                />
            </form>

            <div
                data-test="data-grid"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
                {data.map((row) => (
                    <div key={row.name} className="border border-gray-300 rounded p-4 hover:bg-[#1f1f1f] hover:shadow-lg hover:shadow-[#333]">
                        <h2 className="text-lg font-bold mb-2">{row.name}</h2>
                        <p><strong>City:</strong> {row.city}</p>
                        <p><strong>Country:</strong> {row.country}</p>
                        <p><strong>Favorite Sport:</strong> {row.favorite_sport}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
