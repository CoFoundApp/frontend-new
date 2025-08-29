"use client";

import { Toaster } from "@/components/ui/sonner";
import client from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ApolloProvider client={client}>
            {children}
            <Toaster />
        </ApolloProvider>
    );
}