
import axios from "axios";
import Box from '@mui/material/Box';
import { DataGrid ,GridToolbar} from '@mui/x-data-grid';
import { Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';


const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'StudentId',
    headerName: 'Student Id',
    width: 150,
    editable: false,
  },
  {
    field: 'Day',
    headerName: 'Paid Day',
    type: 'Date',
    width: 150,
    editable: false,
  },
  ,
   {
    field: 'Month',
    headerName: 'Month',
    width: 150,
    editable: true,
  },
   {
    field: 'Payment',
    headerName: 'Payment',
    width: 150,
    editable: true,
  },
  {
    field: 'Note',
    headerName: 'Notes',
    width: 100,
    editable: true,
    renderCell: renderCellExpand,
  }
];

function renderCellExpand(params) {
  return (
    <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
  );
}
function isOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

const GridCellExpand = React.memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: '100%',
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});


export default function ViewPayment() {
  const [stdArray, setStdArray] = useState([]);


  useEffect(() => {
    axios
    .get(`http://localhost:3001/StudentPayment`)
    .then((response) => {
      console.log(response.data);
      const rowsWithId = response.data.map((row, index) => ({
        ...row,
        id: index + 1, // Generate a unique id using index or use a unique identifier from your data
      }));
      setStdArray(rowsWithId);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  

      
  }, []);
  const mySaveOnServerFunction = (params) => {
    

    // Make an API call to update the changed value in the database
    axios
      .put(`http://localhost:3001/StudentPayment/upd/${params.id}`,params )
      .then((response) => {
        alert("done");
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <>
     
     <Row>
    
     <center> <Col lg={9}>

     <h1>Payments List,</h1>
      <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={stdArray}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        processRowUpdate={(updatedRow, originalRow) =>
          mySaveOnServerFunction(updatedRow)
        }
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Box>
      </Col></center>
     </Row>
   
     </>
   
  );
}