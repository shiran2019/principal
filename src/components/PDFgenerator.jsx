import React from "react";
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ImageUrl} from "./ImageUrl"


pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generatePDF = (values) => {

    if(!values.Month || !values.teacherId || !values.Basic || !values.Allowance || !values.Salary || !values.Day){
        toast.warn("Please fill the form first")
        return
    }
const tot = parseInt(values.Basic) + parseInt(values.Allowance)
const epf = (tot * values.epfRate)/100
  const docDefinition = {
    pageMargins: [0, 0, 30, 20],
    content: [
      {
        image: ImageUrl,
        width: 600,
        
       
       
        
      },
      {
        text: 'Pay Sheet',
        style: 'header2'
        
      },
      {
        text: 'ID : '+values.teacherId,
        style: 'title',
      },

      {
        style: 'table',
        table: {
          widths: ['*', '*'],
          body: [
           
            ['Month', values.Month],
            ['Basic Salary', "Rs."+values.Basic],
            ['Allowance', "Rs."+values.Allowance],
            ['Total income', "Rs."+tot],
            ['EPF rate', +values.epfRate+"%"],
            ['EPF deduction', "Rs."+epf],
           
          ]
        }
      },
      ,{
        text: '----------------------------------------',
        style: 'sign',
        
      }
      ,
      {
        text: "Salary     :  Rs."+values.Salary,
        style: 'sign',
        
      },
      {
        text: '----------------------------------------',
        style: 'title',
        
      },
      ,{
        text: '           Signature                                                                                   day:    '+values.Day,
        style: 'signn',
      }

      

    ],
    styles: {
      header: {
        margin: [0, 0, 20, 30]

      },
      header2: {
        fontSize: 18,
        bold: true,
        margin: [30, 50, 50, 30]

      },
      table: {
        margin: [30, 0, 0, 20]
      },
      title: {
        margin: [30, 0, 0, 20]
      },
      Sal: {
        fontSize: 14,
        margin: [30, 0, 0, 40]
      },
      sign: {
        
        margin: [30, 0, 0, 20]
      },
      signn: {
        
        margin: [30, 50, 0, 20]
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getBlob((blob) => {
    saveAs(blob, "PaySheet_"+values.teacherId+"_"+values.Month+"_.pdf");
  });
};

const DownloadPDFButton = ({ values }) => {
  const handleClick = () => {
    generatePDF(values);
  };

  
  return (
    <div style={{ marginTop: "10px" }}>
      <Button variant="contained" startIcon={<DownloadIcon />}  onClick={handleClick}>
        Download PDF
      </Button>
      <ToastContainer style={{marginTop:"7%"}}  position="top-center" autoClose={3000} />
    
    </div>
  );
};

export default DownloadPDFButton;
