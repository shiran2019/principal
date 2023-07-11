import React from "react";
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generatePDF = (values) => {

    if(!values){
        alert("Please fill the form first")
        return
    }

  const docDefinition = {
    pageMargins: [30, 0, 30, 20],
    content: [
      {
        text: 'Pay Sheet',
        style: 'header'
        
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
           
          ]
        }
      },
      ,{
        text: '----------------------------------------'
        
      }
      ,
      {
        text: "Salary     :  Rs."+values.Salary,
        
      },
      {
        text: '----------------------------------------',
        style: 'title',
        
      },
      ,{
        text: '           Signature                                                                                   day:    '+values.Day,
        style: 'sign',
      }

      

    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 20, 30]

      },
      table: {
        margin: [0, 0, 0, 20]
      },
      title: {
        margin: [0, 0, 0, 20]
      },
      Sal: {
        fontSize: 14,
        margin: [0, 0, 0, 40]
      },
      sign: {
        
        margin: [0, 0, 0, 20]
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
    </div>
  );
};

export default DownloadPDFButton;
