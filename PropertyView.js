'use strict';
 
var ReactNative = require('react-native');
var React = require('react')
var {
  StyleSheet,
  Image,
  View,
  Text
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    marginTop: 65
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  image: {
    width: 400,
    height: 300
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    margin: 5,
    color: '#656565'
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  }
});

class PropertyView extends React.Component {
 
  render() {
    var profile = this.props.profile;
    var name = profile.first_name+' '+profile.last_name
    /*var stats = property.bedroom_number + ' bed ' + property.property_type;
    if (property.bathroom_number) {
      stats += ', ' + property.bathroom_number + ' ' + (property.bathroom_number > 1
        ? 'bathrooms' : 'bathroom');
    }*/
    //var imdb_link = 'www.imdb.com/title/'+movie.imdbID
    //var type = 'Type: '+movie.Type
    //var price = property.price_formatted.split(' ')[0];
 
    return (
      <View style={styles.container}>
        <Image style={styles.image}
            source={{uri: profile.photo}} />
        <View style={styles.heading}>
          <Text style={styles.price}>{name}</Text>
          <Text style={styles.title}>{profile.email}</Text>
          <View style={styles.separator}/>
        </View>
      </View>
    );
  }
}



module.exports = PropertyView;