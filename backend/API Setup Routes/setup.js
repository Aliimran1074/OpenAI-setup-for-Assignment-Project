const { OpenAI } = require('openai')
const apiKey = process.env.Open_Api_Key
const openai = new OpenAI({ apiKey: apiKey })

module.exports = {openai}