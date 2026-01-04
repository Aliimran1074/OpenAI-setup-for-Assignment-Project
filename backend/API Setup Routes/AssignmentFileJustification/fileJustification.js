const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { text } = require('pdfkit');

pdfjsLib.GlobalWorkerOptions.workerSrc= require.resolve("pdfjs-dist/legacy/build/pdf.worker.js")

const detectPdfFileType= async(pdfBuffer)=>{

    if (!pdfBuffer) {
    throw new Error("No file uploaded or buffer is empty");
  }
const loadingTask=  pdfjsLib.getDocument({data:pdfBuffer})

const pdfDoc= await loadingTask.promise

let textPages = []
let pageWithText=0

for(let i=1;i<=pdfDoc.numPages;i++){
    const page = await pdfDoc.getPage(i)
    const textContent = await page.getTextContent()
    const viewport= page.getViewport({scale:1})

    const headerY=viewport.height*0.85
    const footerY= viewport.height*0.15
    const bodyText=textContent.items.filter(item=>{
      const y = item.transform[5]
      return y > footerY && y <headerY
    })
    .map(item=>item.str)
    .join(" ")
    .trim()
    // const pageText = textContent.items.map(item=>item.str).join(" ").trim()
    textPages.push(bodyText)
    const wordCount =bodyText.split(/\s+/).length
    if(wordCount>10) pageWithText++
    // if(pageText.length>20) pageWithText++
}

let pdfType = "SCANNED"
if(pageWithText==pdfDoc.numPages) pdfType="TEXT"
else if(pageWithText>0) pdfType="MIXED"

return {type:pdfType,textPages}
}


module.exports={detectPdfFileType}