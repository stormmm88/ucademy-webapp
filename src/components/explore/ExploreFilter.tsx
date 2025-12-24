'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getAllCategories } from '@/lib/actions/category.actions';
import { debounce } from 'lodash';
import { IconX } from '@/components/Icons';

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface ExploreFilterProps {
    search: string;
    categorySlug: string;
    categories: Category[];
}

const ExploreFilter = ({ search: initialSearch, categorySlug: initialCategorySlug, categories: initialCategories }: ExploreFilterProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [searchValue, setSearchValue] = useState(initialSearch);
    const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategorySlug);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [loading, setLoading] = useState(false);

    // Fetch categories only if not provided
    useEffect(() => {
        if (initialCategories.length === 0) {
            const fetchCategories = async () => {
                const cats = await getAllCategories({ limit: 100 });
                if (cats) {
                    const plainCats = cats.map(cat => ({
                        _id: String(cat._id),
                        name: cat.name,
                        slug: cat.slug
                    }));
                    setCategories(plainCats);
                }
            };
            fetchCategories();
        }
    }, [initialCategories]);

    // Debounced search handler
    const handleSearch = debounce((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/?${params.toString()}`);
    }, 500);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        handleSearch(e.target.value);
    };

    const handleCategoryChange = (slug: string) => {
        setLoading(true);
        setSelectedCategorySlug(slug);
        const params = new URLSearchParams(searchParams.toString());
        
        if (slug) {
            params.set('category', slug);
        } else {
            params.delete('category');
        }
        params.set('page', '1');
        router.push(`/?${params.toString()}`);
        setLoading(false);
    };

    const clearFilters = () => {
        setSearchValue('');
        setSelectedCategorySlug('');
        router.push('/');
    };

    const hasFilters = searchValue || selectedCategorySlug;

    return (
        <div className="bg-white dark:bg-grayDarker rounded-lg p-6 border border-gray-200 dark:border-gray-200/10">
            <div className="flex gap-4 items-end mb-6">
                {/* Search Input */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Tìm kiếm</label>
                    <Input
                        placeholder="Tìm kiếm khóa học..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="border-pri/50"
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Danh mục</label>
                    <Select 
                        value={selectedCategorySlug} 
                        onValueChange={handleCategoryChange}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* <SelectItem value="">Tất cả danh mục</SelectItem> */}
                            {categories.map((category) => (
                                <SelectItem value={category.slug} key={category.slug}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Clear Filters Button */}
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center justify-center gap-2  px-4 py-2 rounded-lg border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <IconX className="size-4" />
                        <span>Xóa bộ lọc</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ExploreFilter;