import CloseIcon from '@mui/icons-material/Close'
import { Alert, AlertProps, Button, ButtonProps, Snackbar, SnackbarProps } from "@mui/material"
import { Box } from '@mui/system'
import { useState } from "react"

export interface SnackbarButtonProps {
    buttonText: string
    alertContent: React.ReactNode
    buttonProps?: ButtonProps
    snackbarProps?: SnackbarProps
    alertProps?: AlertProps
}

export default function AlertButton({ buttonText, alertContent, buttonProps, snackbarProps, alertProps, }: SnackbarButtonProps) {
    const [open, setOpen] = useState(false)
    const openAlert = () => setOpen(true)
    const closeAlert = () => setOpen(false)


    return <>
        <Button {...buttonProps} onClick={(e) => {
            openAlert()
            buttonProps?.onClick && buttonProps.onClick(e)
        }} >
            {buttonText}
        </Button>
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={open}
            {...snackbarProps}
        >
            <Alert
                severity="error"
                {...alertProps}
            >
                <Box
                    sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}

                >
                    {alertContent}
                    <CloseIcon sx={{ cursor: "pointer" }} onClick={closeAlert} />
                </Box>
            </Alert>

        </Snackbar>
    </>
}