/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';

import { Image, ImageBackground, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeBiometrics, { Biometrics, BiometryTypes } from 'react-native-biometrics';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { BiometricsIcon } from './src/components/icons/BiometricsIcon';
import { WhiteLogo } from './src/components/icons/WhiteIcon';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
const image = './src/assets/LinkDevice/Login_background_gray.png';

const App = ()=>{
  const [auth, setAuth] = useState(false);
  const [isSelected, setSelection] = useState(false);//Checkbox

  const [biometrics, setBiometrics] = useState(false);
  const [llave, setLlave] = useState('');
    //const {users, isLoading, errorMessage} = useUsers();
    //Requisitos
    // 1 - El dispositivo no se encuentra vinculado a otro usuario
    // Revisar si esta vinculado a otro usuario
      //SI ESTA VINCULADO
        //No mostrar
      //NO  ESTA VINCULADO

    // 2 - El dispositivo cuenta con seguridad biométrica
    rnBiometrics.isSensorAvailable()
    .then((resultObject) => {
        const { available, biometryType } = resultObject;

        if (available && biometryType === BiometryTypes.TouchID) {
        //setTouchID(true);
        console.log('TouchID is supported');
        } else if (available && biometryType === BiometryTypes.FaceID) {
        //setFaceID(true);
        console.log('FaceID is supported');
        } else if (available && biometryType === BiometryTypes.Biometrics) {
        setBiometrics(true);
        console.log('Biometrics is supported');
        } else {
        console.log('Biometrics not supported');
        }
    });
    // Verificacion de Llave RSA
    rnBiometrics.biometricKeysExist()
    .then((resultObject) => {
    const { keysExist } = resultObject;

    if (keysExist) {
        console.log('Keys exist');
    } else {
        console.log('Keys do not exist or were deleted');
        console.log('CREANDO LLAVE');
        crearLlave();
    }
    });

    // Creacion de llave RSA
    const crearLlave = () => {
    rnBiometrics.createKeys()
    .then((resultObject) => {
        const { publicKey } = resultObject;
        setLlave(publicKey);
    });
    };

    // Metodo de lectura de huella
    const fingerprint = () => {
    let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString();
    let payload = epochTimeSeconds + 'some message';
    console.log('Leyendo huella');

    rnBiometrics.createSignature({
        promptMessage: 'Sign In', //Mensaje
        payload: payload,
    })
    .then((resultObject) => {
        const { success } = resultObject;
        if (success) {
        setAuth(success);
        }
    });
    };

    // 3 - El usuario no ha solicitado omitir la vinculación para este dispositivo
    // const [vinculacion, setVinculacion] = useState(false);

  return (
    <View style={styles.container}>
      <ImageBackground  source={require(image)} resizeMode="cover" style={styles.bgImage}>
          <WhiteLogo />



        <View style={styles.bgInfo}>
          <BiometricsIcon width={24} height={24}/>
          <Text>¿Deseas Vincular este dispositivo para ingresar con Biometría?</Text>

          <BouncyCheckbox
            size={25}
            fillColor="#0377b3"
            unfillColor="#FFFFFF"
            text="Deseo vincular este dispositivo a mi usuario"
            iconStyle={{ borderColor: '#0377b3' }}
            iconInnerStyle={{ borderWidth: 2 }}
            textStyle={{ fontFamily: 'JosefinSans-Regular' , fontSize:25, color: '#7F7F7F' }}
            onPress={() => {setSelection(true);}}
          />
           {/* <Text>Deseo vincular este dispositivo a mi usuario</Text> */}

          <TouchableOpacity
            style={styles.fabLocation}
            onPress={()=> fingerprint()}
          >
            <View style={styles.fab}>
              <Text style={styles.fabText}>VINCULAR</Text>
            </View>
          </TouchableOpacity>

          <Modal
            animationType='fade'
            onDismiss={() => {}}
            onShow={() => {}}
            transparent
            visible={true}
          >
            <View
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}}
            >
              <WhiteLogo />

            </View>
          </Modal>

          <Text style={styles.hipervinculo}
                onPress={() => Linking.openURL('http://google.com')}>
            Omitir para este dispositivo
          </Text>
        </View>


      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    margin: 8,
  },
  hipervinculo: {
    color: '#7F7F7F',
    textAlign:'center',
    textDecorationLine: 'underline',
  },
  biometricsImage: {
    width: 40,
    height: 40,
  },
  bgImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  bgInfo: {
    backgroundColor: 'white',
    
  },
  fab: {
    margin: 10,
    backgroundColor: '#0377b3',
    width: 110,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 10
  },
  fabLocation: {
    alignItems: 'center',
    margin: 10,
    top: 20,
    marginBottom: 10
  },
  fabText: {
    color: 'white',
    fontFamily: 'Lato-Regular',
    fontSize: 25,
    alignSelf: 'center',
  },
});
export default App;
