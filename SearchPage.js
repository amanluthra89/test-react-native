'use strict';
 
var ReactNative = require('react-native');
var React = require('react');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image,
} = ReactNative;
var SearchResults = require('./SearchResults');


function piplUrlForQueryAndPage(key, value, pageNumber) {
  var data = {
      r: 'json'
  };
  data[key] = value;
 
  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');
 
  return 'http://www.omdbapi.com/?'+querystring;
};


function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;
 
  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');
 
  return 'http://api.nestoria.co.uk/api?' + querystring;
};

var styles = ReactNative.StyleSheet.create({
	description: {
	marginBottom: 20,
	fontSize: 18,
	textAlign: 'center',
	color: '#656565'
	},
	container: {
	padding: 30,
	marginTop: 65,
	alignItems: 'center'
	},
	flowRight: {
	flexDirection: 'row',
	alignItems: 'center',
	alignSelf: 'stretch'
	},
	buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  height: 36,
	  flex: 1,
	  flexDirection: 'row',
	  backgroundColor: '#48BBEC',
	  borderColor: '#48BBEC',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  justifyContent: 'center'
	},
	searchInput: {
	  height: 36,
	  padding: 4,
	  marginRight: 5,
	  flex: 4,
	  fontSize: 18,
	  borderWidth: 1,
	  borderColor: '#48BBEC',
	  borderRadius: 8,
	  color: '#48BBEC'
	},
	image: {
  	  width: 217,
	  height: 138
	}
});

class SearchPage extends React.Component {

_executeQuery(query) {
  console.log(query);
  this.setState({ isLoading: true });
  fetch(query)
  .then(response => response.json())
  .then(json => this._handleResponse(json.response))
  .catch(error =>
     this.setState({
      isLoading: false,
      message: 'Something bad happened ' + error
   }));
}
 
_handleResponse(response) {
  this.setState({ isLoading: false , message: '' });
  if (response.application_response_code.substr(0, 1) === '1') {
  	this.props.navigator.push({
  		title: 'Results',
  		component: SearchResults,
  		passProps: {listings: response.listings}
	});
  } else {
    this.setState({ message: 'Location not recognized; please try again.'});
  }
}

_executePiplQuery(query) {
  console.log(query);
  this.setState({ isLoading: true });
  fetch(query)
  .then(response => response.json())
  .then(json => this._handlePiplResponse(json.Search))
  .catch(error =>
     this.setState({
      isLoading: false,
      message: 'Something bad happened ' + error
   }));
}
 
_handlePiplResponse(response) {
  if (typeof response == 'undefined') {
  	this.setState({ isLoading: false, message: 'No movies found. Please try again.'})
  } else {
  this.setState({ isLoading: false , message: '' });
  	this.props.navigator.push({
  		title: 'Results',
  		component: SearchResults,
  		passProps: {search: response}
	});
  }
}

onLocationPressed() {
  navigator.geolocation.getCurrentPosition(
    location => {
      var search = location.coords.latitude + ',' + location.coords.longitude;
      this.setState({ searchString: search });
      var query = urlForQueryAndPage('centre_point', search, 1);
      this._executeQuery(query);
    },
    error => {
      this.setState({
        message: 'This feature is not currently active.'
      });
    });
}

onSearchPressed() {
  //var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
  var query = piplUrlForQueryAndPage('s', this.state.searchString, 1);
  //this._executeQuery(query);
  this._executePiplQuery(query);
}

  constructor(props) {
  super(props);
  this.state = {
    searchString: 'Star Wars',
    isLoading: false,
    message: ''
  };
}
  onSearchTextChanged(event) {
  console.log('onSearchTextChanged');
  this.setState({ searchString: event.nativeEvent.text });
  console.log(this.state.searchString);
}
  render() {
  	var spinner = this.state.isLoading ?
  ( <ActivityIndicator
      size='large'/> ) :
  ( <View/>);
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Movie search test app!
        </Text>
        <View style={styles.flowRight}>
		  <TextInput
  			style={styles.searchInput}
  			value={this.state.searchString}
  			onChange={this.onSearchTextChanged.bind(this)}
  			placeholder='Search via movie name'/>
		  <TouchableHighlight style={styles.button}
	        underlayColor='#99d9f4'
	        onPress={this.onSearchPressed.bind(this)} >
	        <Text style={styles.buttonText}>Go</Text>
		  </TouchableHighlight>
		</View>
		<TouchableHighlight style={styles.button}
		    underlayColor='#99d9f4'
		  onPress={this.onLocationPressed.bind(this)} >
		  <Text style={styles.buttonText}>Location</Text>
		</TouchableHighlight>
		<Image source={require('./Resources/Movies.jpg')} style={styles.image}/>
		{spinner}
		<Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}

module.exports = SearchPage;
