import { useUser } from "@auth0/nextjs-auth0"

export interface NavOption {
    text: string;
    route: string;
    show: "login-only" | "logged-out-only" | "always"
}

export interface NavOptionProps {
    options: NavOption[]
    render: (option: NavOption) => JSX.Element
}

// Higher order component for displaying nav options based on user login state
const NavOptions = ({ options, render }: NavOptionProps) => {
    const { isLoading, user } = useUser()
    const doShowOption = ({ show }: NavOption) => {
        switch (show) {
            case "always":
                return true
            case "login-only":
                return !!user
            case "logged-out-only":
                return !user
        }
    }

    if (isLoading) {
        return null
    }

    return <>{options.filter(doShowOption).map(render)}</>
}

export default NavOptions