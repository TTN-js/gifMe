// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'backbone' // this line will auto-import Backbone 

function app() { // this line starts the your coded app

// backbone/model - is a record from a table of the database /collection - is the table itself

const IphyCollection = Backbone.Collection.extend({ // this line creates a collection, a collection is a set of models. 
	url: "http://api.giphy.com/v1/gifs/search?",
	_apiKey: "dc6zaTOxFJmzC",

	parse: function(rawData){ // you need to use parse to get the model data from the colection
		console.log(rawData) //check if data is returned 
		return rawData.data
	}
})

//reactView 

// this component creates a home view that renders a default home page that has a header and a searchBar
var HomeView = React.createClass({ 
	render: function(){
		return(
			<div className="pageContainer">

			<h1 className="pageTitle">gifMe</h1>
			<SearchBar/>

			</div>

			)
	}
})

// this component creates the search bar and handels search function, 
const SearchBar = React.createClass ({
	_search: function(keyEvent) { // search function listening for a keyEvent
		if (keyEvent.keyCode === 13){ // if key pressed is "enter" 
			window.location.hash = `scroll/${keyEvent.target.value}` 
			// change the hash to the scroll/ and whatever the search value is. `backticks` are a new syntax that create template literals. This allow multiline strings and interpolation of functions
			keyEvent.target.value = '' // clear the search bar 
		}
	},
	// this function renders the search bar, onKeyDown listens to keys being pressed down, everytime a key is pressed down the _search function is ran
	render: function(){
		return <input className="searchBar" onKeyDown={this._search}/> //this refers to the search bar. 
	}
})


var SearchView = React.createClass({ 

	componentWillMount: function(){ //life cycle function 
		var self = this
		this.props.gifs.on("sync", function() {self.forceUpdate()}) // forceUpdate is used to force a component and its children to re-render on the collections sync event
	},

	render: function(){ // rendering stuffs, passes down props.gifs from the parent and then renders Scroll component

		return(
			<div className="pageContainer">

			<h1 className="pageTitle">gifMe</h1>
			<SearchBar/>
			<Scroll gifs={this.props.gifs}/>

			</div>

			)
	}

})

//scroll component that is rendered out once a user searches for somthing. 
const Scroll = React.createClass({
	_getGifsJSX: function(objArr){
		var gifsArr = [] //creates an empty array to push object into 
		var counter = 0 //creates a starting point for keys used in react to allow faster renders, not needed but used anyways. 

		objArr.forEach(function(gifsObj){ //forEach used to add to each object passed through the function
			counter += 1 
			var component = <Gif gif={gifsObj} key={counter}/> 
			gifsArr.push(component) //push new objects into array
		})
		return gifsArr // returns new array
		},

		render: function(){  
			var gifs = this._getGifsJSX(this.props.gifs.models) // function that renders gifs into a page
			return(
				<div className="gifScroll">
					{gifs}
				</div>
				)
		}
	})

const Gif = React.createClass({  
	render: function(){
		var gifModel = this.props.gif
		return(
			<div className="gif">
				<img src={gifModel.get('images').original.url}/>
			</div>
			)
	}
})

// backboneRouter

var backboneRouter = Backbone.Router.extend({
	routes:{
		"scroll/:query" : "handeleScrollView",
		"*default" : "home"
	},

	handeleScrollView: function(query){
		this.coll.reset()
		this.coll.fetch({
			data: {
				q: query,
				"api_key": this.coll._apiKey
			}

		})
		DOM.render(<SearchView gifs={this.coll}/>, document.querySelector('.container'))
		console.log(this.coll)
	},

	home: function(){
		location.hash = "home"
		DOM.render(<HomeView/>, document.querySelector('.container'))
	},

	initialize: function(){
		this.coll = new IphyCollection
		Backbone.history.start()
	}

})

	var rtr = new backboneRouter()

}

app() // this line invokes the your app




