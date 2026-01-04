const { pdfToImageBuffer } = require('../../PDFToImageToBlocks/pdfToImage')
const {detectPdfFileType}= require('../AssignmentFileJustification/fileJustification')

// const 

const checkPdfFile = async(req,res)=>{
try {
  if(!req.file) return res.status(400).json({message:"PDF not Found"})
    console.log("File:",req.file)
    const pdfBuffer= req.file.buffer
    const data = await detectPdfFileType(pdfBuffer)
    console.log(data)
    if(!data){
      return res.status(400).json({message:"Issue in Getting File Data"})
    }

    const pdfType = data.type
    if(pdfType=="MIXED" || pdfType=="SCANNED") {
     const images =  await pdfToImageBuffer(pdfBuffer)
    //  run logic to check assignment of pics
     } console.log('PDF type:',data.type)
     
    return res.status(200).json({message:"Data of PDF Found",data})
} catch (error) {
  console.log(" Error in  Check PDF File Function",error)
  return res.status(404).json({message:"Error in Check PDF File Function",error})
}
}


module.exports= {checkPdfFile}