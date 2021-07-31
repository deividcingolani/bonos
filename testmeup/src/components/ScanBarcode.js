import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BarcodeMask from 'react-native-barcode-mask';
import { RNCamera } from 'react-native-camera';

import getToken from '../api/getToken';

class ScanBarcode extends Component {

  static navigationOptions = {
    title: 'Escanea el Código QR',
  };


  constructor(props) {

    super(props);

    this.state = {
      url: '',
      token: '',
      eid: '',
      valid_ticket: '',
      token_storate: 'true',
      name_customer: '',
      seat: '',
      checkin_time: '',
      e_cal: '',
      QR_Assigned_App: false
    }

  }


  render() {

    let validJXS = <View></View>;
    if (this.state.valid_ticket === 'SUCCESS') { 
      validJXS = <View style={styles.success}>
        <Text style={styles.valid_text}>V</Text>
      </View>;
    } else if (this.state.valid_ticket === 'FAIL') {
      validJXS = <View style={styles.fail}>
        <Text style={styles.valid_text}>X</Text>
      </View>;
    }

    const seatJXS = this.state.seat ? (

      <Text style={styles.label}>
        ---: <Text style={styles.value}> {this.state.seat}</Text>
      </Text>

    ) : <View></View>;


    const customerJXS = this.state.name_customer ? (

      <Text style={styles.label}>
        Cliente: <Text style={styles.value}> {this.state.name_customer}</Text>
      </Text>

    ) : <View></View>;


    const checkinJXS = this.state.checkin_time ? (

      <Text style={styles.label}>
        Check-in: <Text style={styles.value}> {this.state.checkin_time}</Text>
      </Text>

    ) : <View></View>;


    const ecalJXS = this.state.e_cal ? (

      <Text style={styles.label}>
        Fecha reserva: <Text style={styles.value}> {this.state.e_cal}</Text>
      </Text>

    ) : <View></View>;


    return (

      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permisos para usar la cámara',
            message: 'Necesitamos algunos permisos para usar la cámara',
            buttonPositive: 'Sí',
            buttonNegative: 'No',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permisos para el uso del audio',
            message: 'Necesitamos algunos permisos para el audio',
            buttonPositive: 'Sí',
            buttonNegative: 'No',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
        >
          {this.state.QR_Assigned_App === false &&
            <BarcodeMask />
          }
        </RNCamera>


        <View style={styles.result}>

          <View style={styles.result_left}>
            {validJXS}
          </View>

          <View style={styles.result_right}>

            {customerJXS}

            {seatJXS}

            {ecalJXS}

            {checkinJXS}
          </View>

        </View>

      </View>
    )


  }

  reset() {

    this.setState({
      token_storate: '',
      valid_ticket: '',
      name_customer: '',
      seat: '',
      checkin_time: '',
      e_cal: ''
    });

  }

  async onBarCodeRead(event) {

    const token = await AsyncStorage.getItem('@token');
    const url = await AsyncStorage.getItem('@url');
    const eid = JSON.stringify(this.props.navigation.getParam('eid', 0));


    if (event.data === this.state.token_storate) {



    } else if (event.data !== 'null') {
      // Validate Ticket 
      if (this.state.QR_Assigned_App === false) {

        fetch(url + 'wp-json/meup/v1/validate_ticket/',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',

            },
            body: JSON.stringify({
              token: token,
              qrcode: event.data,
              eid: eid
            })
          })
          .then(res => res.json())
          .then((resjson) => {
            console.log('\n\nRESJSON\n', resjson, '\n\n\n')

            if (resjson.status === 'FAIL') {
              Alert.alert(
                'FALLO',
                resjson.msg,
                [
                  {

                    text: 'Continuar',
                    onPress: () => {
                      this.setState({ ...this.state, QR_Assigned_App: false }
                      )
                      this.reset()
                    }
                  }
                ]
              );

            } else if (resjson.status === 'SUCCESS') {
              Alert.alert(
                'VÁLIDO',
                resjson.msg,
                [
                  {

                    text: 'Continuar',
                    onPress: () => {
                      this.setState({ ...this.state, QR_Assigned_App: false }
                      )
                      this.reset()
                    }
                  }
                ]
              );
            }

            this.setState({
              valid_ticket: resjson.status,
              name_customer: resjson.name_customer,
              seat: resjson.seat,
              checkin_time: resjson.checkin_time,
              e_cal: resjson.e_cal,
              QR_Assigned_App: true
            });

          })
          .catch((error) => {
            alert('Error, escanéalo de nuevo, por favor');
          });

        this.setState({ token_storate: event.data });
      }
    }

  }





}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',

  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  result: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'flex-start',
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  result_left: {
    flex: 1,
    backgroundColor: '#000000',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff'
  },
  result_right: {
    flex: 4,
    backgroundColor: '#000000',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 5
  },
  success: {
    backgroundColor: '#90ba3e',
    flex: 1,
    width: '100%',
    height: '100%',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fail: {
    backgroundColor: 'red',
    flex: 1,
    width: '100%',
    height: '100%',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center'

  },
  valid_text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    color: '#ccc',
  },
  value: {
    color: '#fff',
    fontWeight: 'bold'
  },


});


export default ScanBarcode;
