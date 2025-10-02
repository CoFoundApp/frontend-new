"use client";

import LoadingScreenPage from "@/components/application/loading-screen";
import { GET_CURRENT_USER, GetCurrentUserResult } from "@/graphql/user";
import { useCurrentUser } from "@/stores/current-user";
import { useQuery } from "@apollo/client/react";
import { ReactNode, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CurrentUserProvider({
    children,
}: {
    children: ReactNode;
}) {
    const { user, setUser, clearUser } = useCurrentUser();
    const router = useRouter();
    const pathname = usePathname();

    const { data, loading, error } = useQuery<GetCurrentUserResult>(
        GET_CURRENT_USER,
        {
            fetchPolicy: "network-only",
            errorPolicy: "all",
        }
    );

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

    const displayName =
        data?.myProfile?.display_name?.toString().trim() ?? "";

    const shouldRedirect =
        !loading &&
        !error &&
        !!data?.myProfile &&
        displayName.length === 0 &&
        pathname !== "/introduction";

    useEffect(() => {
        if (shouldRedirect) {
            router.replace("/introduction");
        }
    }, [shouldRedirect, router]);

    const showInitialLoader = useMemo(() => loading && !user, [loading, user]);
    if (showInitialLoader) return <LoadingScreenPage />;

    if (shouldRedirect) return <LoadingScreenPage />;

    return <>{children}</>;
}