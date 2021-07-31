import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, TouchableWithoutFeedback} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';



import getToken from '../api/getToken';
import ScanBarcode from './ScanBarcode';
import EventsApi from '../api/EventsApi';


class Events extends Component {

    static navigationOptions = {
        title: 'Establecimientos Adheridos'
    };

    constructor(props) {
        
        super(props);
        
        this.state = { data: [] };

    }

    componentDidMount() {
        getToken()
        .then(token => EventsApi(token))
        .then(data => this.setState({ data: ( data.status === 'SUCCESS' ) ? data.events : ''  }) )
        .catch(err => console.log( err ) );
    }

    async logout(){

      await AsyncStorage.setItem( '@token', '' );
      await AsyncStorage.setItem( '@isLoggedIn', '0' );
      this.props.navigation.navigate('Login');
    }



    render() {
        
         return (

          

          <View style={styles.container}>
            

            <View style={styles.heading}>
              <Text>www.bonogallur.es</Text>

              <TouchableOpacity onPress={ () => this.logout() }>
                <Text>Salir</Text>

              </TouchableOpacity>  
            </View>
            

            <FlatList
              data={this.state.data}
              renderItem={ ( {item, index} ) => 
                <View style={{
                  flex: 1,
                  backgroundColor: index % 2 == 0 ? '#eee' : '#fcfcfc',
                  padding:5
                }}>
                  
                  <TouchableWithoutFeedback
                      onPress={() => this.props.navigation.navigate( 'ListTickets', { eid: parseInt( item.ID ), title: item.post_title } ) }
                    >
                    <View style={styles.item}>
                      <Text style={styles.itemindex}>{index+1}</Text>
                      <Text style={styles.itemtext}>{ item.post_title }</Text>
                    </View>
                  </TouchableWithoutFeedback>

                </View>
              }
              keyExtractor={item => item.post_title}

            />

          </View>
        )
        
    }

}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#fff',
    },

    item: {
      fontSize: 16,
      padding: 10,
      flex: 1,
      flexDirection: 'row'
    },
    itemindex: {
      
      color: '#000',
      marginRight: 15,
      fontWeight: 'bold',
    },
    

    heading: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      backgroundColor: '#f29d00',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 30,
      padding: 15

    }
});


export default Events;
