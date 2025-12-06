const openai = require('./setup')


const assignmentCreationByTopicName=async(req,res)=>{
    try {
        const {topicsName,difficultyLevel,format,noOfQuestions}=req.body
        if(!topicsName || !Array.isArray(topicsName) ||topicsName.length===0){
            console.log("Please Provide Topic")
            return res.status(400).json({message:"Please Provide Topic"})
        }
        const instruction = `You are a teaching assistant. I will provide you an array of topics.You will create an assignment consist of ${noOfQuestions} question with diffculty level : ${difficultyLevel} and format will be ${format} based`
        const topicList = `Topics : ${JSON.stringify(topics)}`
        const prompt = `${instruction} \n\n ${topicList}`
        const result = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }]
        })
        if (!result) {
            console.log("Issue in Setup")
            return res.status(400).json({ message: 'Issue in Setup' })
        }
        console.log(result)
        const finalResult = result.choices[0].message.content
        return res.status(200).json({ message: 'Done', finalResult })
    } catch (error) {
        console.log("Error in Setup Function",error)
        return res.status(404).json({message:'Error in Setup Function',error})
    }
}

function cleanpdfText(text){
    const lines= text.split('\n').map(l=>l.trim()).filter(l=>l !=="")
    const freq={}
    lines.forEach(line=>{
        freq[line]=(freq[line] || 0)+1
    })
    const totalLines = lines.length

 const protectedKeywords = [
    "definition", "concept", "example", "explain", "introduction",
    "summary", "topic", "advantages", "disadvantages"
  ]

  const repeatingLines = Object.keys(freq).filter(line => {
    // Must be repeated many times
    if (freq[line] < 3) return false;

    // Must be short (header/footer)
    if (line.length > 50) return false;

    // Must not contain academic content
    const lower = line.toLowerCase();
    if (protectedKeywords.some(k => lower.includes(k))) return false;

    // Must appear in 40%+ lines (across pages)
    if (freq[line] < totalLines * 0.4) return false;

    return true;
  });

  const cleaned = lines.filter(line => !repeatingLines.includes(line));
  return cleaned.join("\n");
}

const createAssignmentByGivingPdf=async(req,res)=>{
    try {
    const pdfPath = req.file.path;
    const fileBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(fileBuffer);

    let text = pdfData.text;
    text = removeHeadersFooters(text);

    const prompt = `
You are an expert examiner. Based on this PDF content, generate:

- 10 MCQs (4 options + correct answer)
- 5 Short Questions
- 3 Long Questions
- 1 Case Study Question

Use ONLY this content:

${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    return res.json({
      success: true,
      assignment: response.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "AI error" });
  }
}