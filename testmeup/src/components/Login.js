import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Keyboard, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


import checkLogin from '../api/checkLogin';
import getToken from '../api/getToken';
import LoginApi from '../api/LoginApi';

class Login extends Component {

    static navigationOptions = {
        title: 'Bonos Gallur'
    };

    constructor(props) {
        super(props);
        this.state = {
            url: 'https://bonogallur.es/',
            user: '',
            pass: '',
        }
    }
   
    _validate(){
        const{ url, user, pass} = this.state;
        if( url == '' ){
            alert( 'La URL https://bonogallur.es/ no está escrita' );
            return false;
        }

        if( user == '' ){
            alert( 'Te has olvidado de escribir el nombre de usuario' );
            return false;
        }
      
        if( pass == '' ){
            alert( 'Te has olvidado de escribir la contraseña' );
            return false;
        }
    }

    _onLogin = async() => {

        this._validate();

        const {navigate} = this.props.navigation;

        const{ url, user, pass} = this.state;
        

        await LoginApi( url, user, pass )
        .then( (resjson) => {
            console.log('\n\n\n\nLOGIN', resjson.status, '\n\n\n')
            if( resjson.status === 'SUCCESS' && this.saveToStorage( resjson.token ) ){
                alert( resjson.msg );
                navigate( 'Events' );
            }else if( resjson.status === 'FALLO' ) {
                alert( resjson.msg );
            }
            
        } )
        .catch( (err) => { console.log(err) } );
       
    }

    async saveToStorage( token ){

        if( token ){

            await AsyncStorage.setItem( '@token', token );
            await AsyncStorage.setItem( '@isLoggedIn', '1' );
            await AsyncStorage.setItem( '@url', this.state.url );

            return true;
        }

        return false;

    }

    


    render() {
        const{ url, user, pass} = this.state;

        return (
            <View style={styles.container}>

                <TextInput
                  style={styles.input}
                  placeholder="Escribe: https://bonogallur.es/"
                  onChangeText={ url => this.setState({url})}
                  autoCapitalize = 'none'
                  value={url}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Nombre de usuario"
                  autoCapitalize = 'none'
                  onChangeText={ user => this.setState({user})}
                  value={user}
                  
                />

                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  autoCapitalize = 'none'
                  onChangeText={ pass => this.setState({pass})}
                  value={pass}
                  secureTextEntry
                  keyboardType="default"
                />
               

                <TouchableOpacity style={styles.btn} onPress={ this._onLogin.bind(this) }>
                    <Text style={styles.btn_text}>
                        Iniciar Sesión
                    </Text>
                </TouchableOpacity>
                
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,

        backgroundColor: '#c0d6f1'
    },
    input: {
        height: 40, 
        width: 250, 
        paddingLeft: 10, 
        paddingRight: 10, 
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: '#000000'
    },
    btn: {
        height: 40,
        width: 120,
        backgroundColor: '#f29d00',
        borderColor: '#f29d00',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    btn_text: {
        color: '#fff',
        fontSize: 16,
        borderRadius: 5
    }

});

export default  Login;
