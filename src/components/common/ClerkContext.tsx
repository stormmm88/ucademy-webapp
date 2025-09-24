'use client';   

import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

const ClerkContext = ( { children }: { children: React.ReactNode}) => {
    return <ClerkProvider>{children}</ClerkProvider>
}

export default ClerkContext