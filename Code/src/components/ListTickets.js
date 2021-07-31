import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Text, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';



class ListTickets extends Component {

  static navigationOptions = {
        title: 'Escanear QR',
  };

     


    constructor(props) {
        
        super(props);
        this.state = { eid: [] };

    }

    componentDidMount() {
      
      const { navigation } = this.props;
      this.setState({eid: parseInt( JSON.stringify(navigation.getParam('eid', 0)) ) })
        
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
          
                <Text style={styles.heading}>{this.props.navigation.getParam( 'title' )}</Text>
                
              </View>

            <Button  
              title="Escanear Código QR"
              onPress={ () => this.props.navigation.navigate('ScanBarcode', { eid: this.state.eid } ) } />
                   
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
      padding: 10,
      fontSize: 18,
      
      borderTopWidth: 1,
      borderBottomColor: '#000000',
      height: 44,
    },
    heading: {
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: '#f29d00',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 10,
      padding: 15

    }
});


export default ListTickets;
