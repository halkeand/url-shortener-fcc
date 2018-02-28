const mongoose = require('mongoose')
const UrlModel = require('./UrlModel')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const isUrl = require('is-url')
const sanitize = require('sanitize-html')
const app = express()

const addNewUrlToDB = ({ baseUrl, shortenedNum }) => {
	const newUrl = new UrlModel({ baseUrl, shortenedNum })
	return newUrl.save()
}

//MongoDB connection
mongoose
	.connect(process.env.DB_URL)
	.then(() => console.log('connected to mongo'))
	.catch(e => console.error.bind(console, 'connection error:'))
 
//Middlewares
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)

// Home route
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html')
})

//Routes to shortened urls
app.get('/:urlNum', (req, res) => {
  const shortenedNum = req.params.urlNum
  UrlModel.findOne({shortenedNum}, (e, url) => {
    if (!url || e) {
      res.redirect('/')
    }
    else res.redirect(url.baseUrl)
  })
})

// Form submitting to retrieve a shortened URL
app.post('/', (req, res) => {
	let { urlToShorten } = req.body
  urlToShorten = sanitize(urlToShorten).replace('&quot;&quot;', '')
  console.log(urlToShorten)
  
	if (isUrl(urlToShorten)) {

		UrlModel.count({})
			.then(urlsCount => {
				const shortenedNum = urlsCount + 1

				addNewUrlToDB({
					baseUrl: urlToShorten,
					shortenedNum
				}).catch(e => console.log(e))

				res.json({
					response: 'Here is your shortened URL, enjoy !',
					shortenedUrl: `https://worried-lifter.glitch.me/${shortenedNum}`
				})
			})
			.catch(e => console.log(e))
	} else {
		res.json({ response: 'Please enter a valid url' })
	}
})

app.listen(process.env.PORT, () =>
	console.log(`Listeneing on ${process.env.PORT}`)
)