'use client';

import { useRouter} from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    hasNextPage: boolean;
    search?: string;
    categorySlug?: string;
}

const Pagination = ({ currentPage, hasNextPage, search = '', categorySlug = '' }: PaginationProps) => {
    const router = useRouter();

    const handlePrevPage = () => {
        if (currentPage === 1) return;
        const params = new URLSearchParams();
        params.set('page', String(currentPage - 1));
        if (search) params.set('search', search);
        if (categorySlug) params.set('category', categorySlug);
        router.push(`/?${params.toString()}`);
    };

    const handleNextPage = () => {
        if (!hasNextPage) return;
        const params = new URLSearchParams();
        params.set('page', String(currentPage + 1));
        if (search) params.set('search', search);
        if (categorySlug) params.set('category', categorySlug);
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-10">
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border transition-all ${
                    currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-pri text-pri hover:bg-pri hover:text-white'
                }`}
            >
                ← Trang trước
            </button>

            <span className="px-4 py-2 text-sm font-semibold">
                Trang {currentPage}
            </span>

            <button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className={`px-4 py-2 rounded-lg border transition-all ${
                    !hasNextPage
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-pri text-pri hover:bg-pri hover:text-white'
                }`}
            >
                Trang sau →
            </button>
        </div>
    );
};

export default Pagination;