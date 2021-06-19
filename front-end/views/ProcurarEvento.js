import React, {useState, useEffect} from 'react';
import { View, Text, Keyboard, StyleSheet, Platform, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import {css} from '../assets/css/Css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BarCodeScanner} from 'expo-barcode-scanner';
import config from '../config/config'

export default function ProcurarEvento (props){

    const [hasPermission, setHasPermission] = useState(null);
    const [displayQR, setDisplayQR] = useState('none');
    const [eventCodeInput, setEventCodeInput] = useState(null);
    const [displayTela, setDisplayTela] = useState('flex');
  
    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    async function handleBarCodeScanned({ type, data }){
        setDisplayQR('none');
        Keyboard.dismiss();
        await searchCode(data);
    };

    async function searchCode(eventCode){
        setDisplayQR('none');
        setDisplayTela('flex');
        if (eventCode=="" || eventCode==null){
            Alert.alert("ERRO","Preencha o Código do Evento Corretamente!");
            Keyboard.dismiss();
            setEventCodeInput(null);
        }else{
            let response = await fetch(config.urlRoot+`event/findByCode/${eventCode}`);
            let json = await response.json();
            if (response.status != 200){
                Alert.alert("ERRO",json.message);
                Keyboard.dismiss();
                setEventCodeInput(null);
                await AsyncStorage.clear();
            }else{
                setEventCodeInput(null);
                let eventInformation = await AsyncStorage.setItem('eventInformation', JSON.stringify(json));
                props.navigation.navigate('EntrarEvento');
            }
        }

    }

    return(
        <KeyboardAvoidingView 
            style={[css.container, css.darkbg, styles.droidSafeArea]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            
        <View style={styles.tela__toda(displayTela)}>
            
            <View style={css.login__logomarca}>
                <Image source={require('../assets/img/logomarca.png')}/>
            </View>

            
            
            <View style={css.login__form}>
                <TextInput 
                    style={css.login__input} 
                    placeholder="Código do Evento"
                    onChangeText={text=>setEventCodeInput(text)}
                    value={eventCodeInput}
                />
                <TouchableOpacity style={css.login__button} onPress={()=>searchCode(eventCodeInput)}>
                    <Text style={css.login__buttonText}>Procurar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={css.login__button} onPress={()=>{
                    Keyboard.dismiss();
                    setDisplayQR('flex');
                    setDisplayTela('none');
                    }}>
                    <Text style={css.login__buttonText}>Scanear QR CODE</Text>
                </TouchableOpacity>
            </View>
        </View>

            <TouchableOpacity style={styles.login__button_fechar(displayQR)} onPress={()=>{
                setEventCodeInput("");
                Keyboard.dismiss();
                setDisplayQR('none');
                setDisplayTela('flex');
                }}>
                <Text style={styles.login__buttonText2(displayQR)}>Fechar Scanner</Text>
            </TouchableOpacity>

            <BarCodeScanner
                onBarCodeScanned={displayQR==='none' ? undefined : handleBarCodeScanned}
                style={css.qr__code(displayQR)}
            />

        </KeyboardAvoidingView>
        
    );
}

const styles = StyleSheet.create({
    droidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 35 : 0
    },
    scrollview:{
        width: '100%',
        alignContent: 'center',
        textAlign: 'center'
    },
    listItens:{
        width: '80%',
        backgroundColor: '#f7fa39',
        alignSelf: 'center',
        borderRadius: 7,
        marginVertical: 6,
        alignContent: 'center',
        paddingVertical: 5,
        textAlign: 'center'
    },
    title:{
        fontWeight:"bold",
        paddingBottom: 25,
        textAlign: "center",
        fontSize:45,
        color: "black"
    },
    text:{
        fontWeight:"bold",
        paddingVertical: 5,
        fontSize:19,
        color: "black"        
    },
    label:{
        paddingBottom: 5
    },
    login__form:{
        width: "80%",
        paddingVertical: 20,
    },
    login__input:{
        backgroundColor: "#FFF",
        fontSize: 19,
        padding: 7,
        paddingLeft: 15,
        marginBottom: 10,
        borderRadius: 14
    },
    label_input:{
        color: '#FFF',
        paddingVertical: 2,
        paddingHorizontal: 5
    },
    login__button:{
        marginTop: 10,
        padding: 8,
        paddingHorizontal: 100,
        backgroundColor: "#fcd526",
        alignSelf: "center",
        borderRadius: 14
    },
    login__buttonText:{
        fontWeight:"bold",
        fontSize:22,
        color: "black"
    },
    login__buttonText2:(display='flex')=>({
        // padding: 100,
        // margin: 100,
        fontWeight:"bold",
        fontSize:22,
        color: "black",
        display: display
    }),
    login__button_fechar:(display='flex')=>({
        marginTop: 100,
        padding: 8,
        paddingHorizontal: 10,
        backgroundColor: "red",
        alignSelf: "center",
        borderRadius: 14,
        display: display
    }),
    qr__code:(display='flex')=>({
        // flex: 1,
        width: '100%',
        height: '100%',
        // paddingVertical: 10,
        // marginVertical: -100,
        // borderRadius: '10',
        // backgroundColor: 'green',
        justifyContent: 'center',
        display: display
    }),
    tela__toda:(display='flex')=>({
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
        display: display
    })
})