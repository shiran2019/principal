import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate() {
  const [showNoImages, setShowNoImages] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowNoImages(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      {!showNoImages ? <CircularProgress /> : <div> No Uploaded images</div>}
    </Box>
  );
}
