"use client";

import LoadingScreenPage from "@/components/application/loading-screen";
import { GET_CURRENT_USER, GetCurrentUserResult } from "@/graphql/user";
import { useCurrentUser } from "@/stores/current-user";
import { useQuery } from "@apollo/client/react";
import { ReactNode, useEffect, useMemo } from "react";

export default function CurrentUserProvider({ 
    children 
}: {
    children: ReactNode;
}) {
    const { user, setUser, clearUser } = useCurrentUser();

    const { data, loading, error } = useQuery<GetCurrentUserResult>(GET_CURRENT_USER, {
        fetchPolicy: "cache-first",
        errorPolicy: "all",
    });

    useEffect(() => {
        if (data?.myProfile && data?.myEmail) {
            setUser({ myEmail: data.myEmail, myProfile: data.myProfile });
        }
    }, [data, setUser]);

    useEffect(() => {
        if (!loading && error) {
            clearUser();
        }
    }, [loading, error, clearUser]);

    const showInitialLoader = useMemo(() => loading && !user, [loading, user]);
    if (showInitialLoader) return <LoadingScreenPage />;

    return <>{children}</>;
}