import React, { useEffect, useState } from 'react'
import { ImageBackground, Text, View, CheckBox, Button } from 'react-native'

const LinkDevice = () => {
    const [auth, setAuth] = useState(false);
    const [isSelected, setSelection] = useState(false);//Checkbox
    const {users, isLoading, errorMessage} = useUsers();
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
        setTouchID(true);
        console.log('TouchID is supported');
        } else if (available && biometryType === BiometryTypes.FaceID) {
        setFaceID(true);
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
    const { keysExist } = resultObject

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
        payload: payload
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
    <View>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>

      <Text>¿Deseas Vincular este dispositivo para ingresar con Biometría?</Text>

      <CheckBox
        value={isSelected}
        onValueChange={setSelection}
        style={styles.checkbox}
      />
      <Text>Deseo vincular este dispositivo a mi usuario</Text>

      <Button
        title="Vincular"
        onPress={() => fingerprint()}
      />

      <Text style={{color: 'blue'}}
            onPress={() => Linking.openURL('http://google.com')}> //
        Omitir para este dispositivo
      </Text>


    </ImageBackground>
    </View>
  )
}

export default LinkDevice
