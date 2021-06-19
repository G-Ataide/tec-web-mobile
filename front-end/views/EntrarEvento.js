import React, {useState, useEffect} from 'react';
import { View, Text, Platform, KeyboardAvoidingView,BackHandler, Image, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import {css} from '../assets/css/Css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import {BarCodeScanner} from 'expo-barcode-scanner';
import config from '../config/config'

export default function EntrarEvento (props){

    const [eventCode,setEventCode]=useState(null);
    const [eventName,setEventName]=useState(null);
    // const [eventTips,setEventTips]=useState(null);
    const [participationName,setParticipationName]=useState(null);
    const [participationEmail,setParticipationEmail]=useState(null);
    const [eventCreatorName,setEventCreatorName]=useState(null);
    const [eventStart,setEventStart]=useState(null);
    const [eventEnd,setEventEnd]=useState(null);
    const [eventTipsCount,setEventTipsCount]=useState(null);

    

    useEffect(()=>{
        async function getUser(){
            let response=await AsyncStorage.getItem('eventInformation');
            let json=JSON.parse(response);
            setEventName(json.name);
            setEventCode(json.code);
            // setEventTips(json.tips);
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

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    async function searchCode(){
        if (participationName == null || participationName == ""){
            Alert.alert("ERRO","Preencha o nome");
        }else if (participationEmail == null || participationEmail == ""){
            Alert.alert("ERRO","Preencha o e-mail");
        }else if (!validateEmail(participationEmail)){
            Alert.alert("ERRO","Preencha corretamente o e-mail");
        }else{
            let response = await fetch(`${config.urlRoot}event/join`,{
                method: 'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: participationName,
                    email: participationEmail,
                    eventCode: eventCode
                })
            });

            let json = await response.json();

            if (response.status != 200){
                Alert.alert("ERRO",json.message);
            }else{
                let eventInformationCode = await AsyncStorage.setItem('eventCode',eventCode);
                let eventInformationUserId = await AsyncStorage.setItem('userId',json.userId.toString());
                props.navigation.navigate('Tips');
            }

        }
    }

    return (


        <KeyboardAvoidingView 
            style={[css.container, css.darkbg]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Text style={styles.title}>{eventName}</Text>
            <Text style={styles.text}>Código: {eventCode}</Text>
            <Text style={styles.text}>Criado Por: {eventCreatorName}</Text>
            <Text style={styles.text}>Inicia em: {eventStart}</Text>
            <Text style={styles.text}>Finaliza em: {eventEnd}</Text>
            <Text style={styles.text}>Quantidade de Pistas: {eventTipsCount}</Text>

            <View style={styles.login__form}>
                <Text style={styles.label}>Nome</Text>
                <TextInput 
                        style={css.login__input} 
                        placeholder="Nome"
                        onChangeText={text=>setParticipationName(text)}
                    />
                <Text style={styles.label}>E-mail</Text>
                <TextInput 
                        style={css.login__input} 
                        placeholder="E-mail"
                        onChangeText={text=>setParticipationEmail(text)}
                    />
            </View>

            <TouchableOpacity style={css.login__button} onPress={()=>searchCode()}>
                <Text style={css.login__buttonText}>PARTICIPAR</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    title:{
        fontWeight:"bold",
        paddingBottom: 30,
        textAlign: "center",
        fontSize:45,
        color: "black"
    },
    text:{
        fontWeight:"bold",
        paddingVertical: 7,
        fontSize:22,
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
})