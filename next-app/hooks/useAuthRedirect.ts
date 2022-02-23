import { useUser } from "@auth0/nextjs-auth0"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Pages from "../constants/Pages.enum"

export interface UseAuthRedirectOptions {
    to: Pages
}

// Redirect the user to some page if they are authenticated
export default function useAuthRedirect({ to }: UseAuthRedirectOptions) {
    const { isLoading, user } = useUser()
    const router = useRouter()

    const doRedirect = !isLoading && user
    const isHandlingRedirect = isLoading || doRedirect

    useEffect(() => {
        if (doRedirect) {
            router.push(to)
        }
    }, [doRedirect])

    return { isHandlingRedirect }
}