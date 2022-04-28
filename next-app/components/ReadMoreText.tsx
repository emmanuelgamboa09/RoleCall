import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import { useState } from "react";

export type ReadMoreTextProps = {
  title: string;
  content: string;
  cutoffLength: number;
  scroll?: DialogProps["scroll"];
};

const ReadMoreText = ({
  title,
  content,
  cutoffLength,
  scroll = "paper",
}: ReadMoreTextProps) => {
  const [readMore, setReadMore] = useState(false);

  const handleOpen = () => {
    setReadMore(true);
  };

  const handleClose = () => {
    setReadMore(false);
  };

  return (
    <Typography variant="body1">
      {content.length > cutoffLength ? (
        <>
          {content.slice(0, cutoffLength)}...
          <br />
          <MuiLink
            href="#"
            onClick={handleOpen}
            data-testid={`ReadMore_${title}`}
          >
            Read More
          </MuiLink>
        </>
      ) : (
        content
      )}
      <Dialog open={readMore} onClose={handleClose} scroll={scroll}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Typography>
  );
};

export default ReadMoreText;
