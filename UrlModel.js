const mongoose = require('mongoose')
const urlSchema = mongoose.Schema({
	baseUrl: String,
	shortenedNum: Number
})

module.exports = mongoose.model('Url', urlSchema)
