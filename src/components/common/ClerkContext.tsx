"use client";   

import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

const ClerkContext = ( { children }: { children: React.ReactNode}) => {
    return <ClerkProvider
                signInUrl="/sign-in"
                signUpUrl="/sign-up"
                signInFallbackRedirectUrl="/"
                signUpFallbackRedirectUrl="/"
            >
                {children}
            </ClerkProvider>
}

export default ClerkContext