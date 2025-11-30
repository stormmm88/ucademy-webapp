'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export default function useQueryString () {

    const router = useRouter()
    const pathname = usePathname()
    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const searchParams = useSearchParams()
    const createQueryString = useCallback(
        (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value)
    
        return params.toString()
        },
        [searchParams]
    )
    return { createQueryString, router, pathname };
}