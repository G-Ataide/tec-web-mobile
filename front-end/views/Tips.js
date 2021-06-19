import React, {useState, useEffect} from 'react';
import { View, Text,StyleSheet,SafeAreaView, ScrollView,Keyboard, FlatList, Platform, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import {css} from '../assets/css/Css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import {BarCodeScanner} from 'expo-barcode-scanner';
import config from '../config/config'

export default function ProcurarEvento (props){

    const [eventCode,setEventCode]=useState(null);
    const [eventName,setEventName]=useState(null);
    const [eventTips,setEventTips]=useState(null);
    const [eventCreatorName,setEventCreatorName]=useState(null);
    const [eventStart,setEventStart]=useState(null);
    const [eventEnd,setEventEnd]=useState(null);
    const [eventTipsCount,setEventTipsCount]=useState(null);
    const [eventTipsInput,setEventTipsInput]=useState(null);
    const [displayQR, setDisplayQR] = useState('none');
    const [displayTela, setDisplayTela] = useState('flex');
    // const [scanned, setScanned] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
    }, []);

    async function handleBarCodeScanned({ type, data }){
        setDisplayQR('none');
        Keyboard.dismiss();
        await serchTip(data);
        
    };

    useEffect(()=>{
        async function getUser()
        {
            let response=await AsyncStorage.getItem('eventInformation');
            let json=JSON.parse(response);
            setEventName(json.name);
            setEventCode(json.code);
            setEventTips(json.tips);
            setEventCreatorName(json.creatorName);
            setEventStart(formataData(json.tsStart));
            setEventEnd(formataData(json.tsEnd));
            setEventTipsCount(Object.keys(json.tips).length);
            // console.log(json.tips);
        }
        getUser();
    },[]);

    function formataData(dataString){
        let year = dataString.substring(0,4);
        let month = dataString.substring(5,7);
        let day = dataString.substring(8,10);

        let hour = dataString.substring(11,13);
        let minute = dataString.substring(14,16);

        return `${day}/${month}/${year} às ${hour}:${minute}`;
    }

    async function serchTip(data) {
        // setScanned(false);
        setDisplayQR('none');
        setDisplayTela('flex');
        let ultima_tentaiva = false;
        if(eventTipsCount == 1){
            ultima_tentaiva = true;
        }

        if (data == null || data == ""){
            Alert.alert("ERRO","Preencha a Pista corretamente!");
        }else{
            let flag = false;
            let flagGanhou = false;
            for(let i=0; i< Object.keys(eventTips).length; i++){
                if(eventTips[i].code.toUpperCase() === data.toUpperCase()){
                    flag = true;
                    // console.log(eventTips[i]);
                    setEventTipsCount(eventTipsCount-1);
                    setEventTipsInput(null);
                    eventTips.splice(i,1);
                    setEventTips(eventTips);
                    if(ultima_tentaiva){
                        let eventInformation = await AsyncStorage.setItem('eventCode',eventCode);
                        let userId = await AsyncStorage.getItem('userId');

                        console.log(userId);

                        let response = await fetch(`${config.urlRoot}event/win`,{
                            method: 'POST',
                            headers:{
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                eventCode: eventCode,
                                userId: userId
                            })
                        });

                        let json = await response.json();

                        flagGanhou = true;

                        if(response.status===200){
                            Alert.alert(
                                "PARABÉNS",
                                "Você GANHOU!!!",
                                [
                                  { text: "OK", onPress: () => props.navigation.navigate('Ranking') }
                                ]
                            );
                        }else{
                            Alert.alert(
                                "ERRO","Tente Novamente!!!",
                            );
                        }
                        
                        
                    }
                    if(!flagGanhou){
                        Alert.alert("Correto", `Faltam ${eventTipsCount-1} Pista(s)` );
                    }
                }
            }
            if(!flag){
                Alert.alert("ERRO","Pista incorreta, Tente novamente!");
                setEventTipsInput(null);
            }
            
        }
        
    }


    return(
        <SafeAreaView  
            style={[css.container, css.darkbg, styles.droidSafeArea]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.tela__toda(displayTela)}>
                <Text style={styles.title}>{eventName}</Text>
                <Text style={styles.text}>Código: {eventCode}</Text>
                <Text style={styles.text}>Finaliza em: {eventEnd}</Text>
                <Text style={styles.text}>Quantidade de Pistas: {eventTipsCount}</Text>
                <Text style={styles.text}>PISTAS:</Text>
                
                <FlatList
                    style={styles.scrollview}
                    data={eventTips}
                    keyExtractor={item => item.id.toString()}
                    renderItem={(obj)=>{
                        return (
                            <Text style={styles.listItens}>{obj.item.description}</Text>
                        )
                    }}

                />  
                <View style={styles.login__form}>
                    <TextInput 
                        style={css.login__input} 
                        placeholder="Pista"
                        onChangeText={text=>setEventTipsInput(text)}
                        value={eventTipsInput}
                    />
                    <TouchableOpacity style={css.login__button} onPress={()=>serchTip(eventTipsInput)}>
                        <Text style={css.login__buttonText}>Enviar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={css.login__button} onPress={()=>{
                        setDisplayQR('flex');
                        setDisplayTela('none');
                        Keyboard.dismiss();
                    }
                        
                        
                    }>
                        <Text style={css.login__buttonText}>Scanear QR CODE</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.login__button_fechar(displayQR)} onPress={()=>{
                setDisplayQR('none');
                setDisplayTela('flex');
                Keyboard.dismiss();
                }}>
                <Text style={styles.login__buttonText2(displayQR)}>Fechar Scanner</Text>
            </TouchableOpacity>
            <BarCodeScanner
                onBarCodeScanned={displayQR==='none' ? undefined : handleBarCodeScanned}
                style={styles.qr__code(displayQR)}
            />
        </SafeAreaView >
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