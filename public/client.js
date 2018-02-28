const slct = selector => document.querySelector(selector)
const responseNode = slct('#js-response')

const clearDomChilds = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  } 
}
const createPara = (appendTo,text) => {
  const elt = document.createElement('p');
  elt.appendChild(document.createTextNode(text))
  appendTo.appendChild(elt)
}

const renderResponse = ({response, shortenedUrl = undefined}) => {
  clearDomChilds(responseNode)
  createPara(responseNode,response)
  shortenedUrl && createPara(responseNode,shortenedUrl)
}

slct('#js-form').addEventListener('submit', e => {
	e.preventDefault()
	const urlToShorten = e.target.elements[0].value
	fetch('/', {
		method: 'POST',
		body: JSON.stringify({ urlToShorten }),
		headers: { 'Content-Type': 'application/json' }
	})
		.then(resp => resp.json())
		.then(renderResponse)
		.catch(e => console.error(e))
})