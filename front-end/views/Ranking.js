import React, {useState, useEffect} from 'react';
import { View, Text,StyleSheet,SafeAreaView, ScrollView,Keyboard, FlatList, Platform, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import {css} from '../assets/css/Css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import {BarCodeScanner} from 'expo-barcode-scanner';
import config from '../config/config'


export default function Ranking (props){

    const [eventCode,setEventCode]=useState(null);
    const [eventRanking,setEventRanking]=useState(null);
    const [lengthEventRanking,setLengthEventRanking]=useState(null);
    const [eventRankingFirsts,setEventRankingFirsts]=useState(null);
    const [eventRankingLasts,setEventRankingLasts]=useState(null);
    

    useEffect(()=>{
        Keyboard.dismiss()
        async function getData(){
            let json=await AsyncStorage.getItem('eventCode');
            setEventCode(json);

            let responseApi = await fetch(`${config.urlRoot}ranking/${json}`,{
                method: 'GET',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            let jsonApi = await responseApi.json();

            // console.log(Object.keys(jsonApi).length);

            let rankingFirsts = [];
            let rankingLasts = [];

            // console.log("UHUL")

            setLengthEventRanking(Object.keys(jsonApi).length);

            for(let i=0; i<Object.keys(jsonApi).length; i++){
                jsonApi[i].order = i+1;
                jsonApi[i].finalizadoEm = (formataData(jsonApi[i].tsCreated));
                if (i+1<=3){
                    // console.log(i+1)
                    rankingFirsts.push(jsonApi[i]);
                }else{
                    rankingLasts.push(jsonApi[i]);
                }
            }
            setEventRanking(jsonApi);
            setEventRankingFirsts(rankingFirsts);
            setEventRankingLasts(rankingLasts);
        }
        getData();
        // console.log(eventRankingFirsts);
        
    },[]);

    function formataData(dataString){
        let year = dataString.substring(0,4);
        let month = dataString.substring(5,7);
        let day = dataString.substring(8,10);

        let hour = dataString.substring(11,13);
        let minute = dataString.substring(14,16);

        return `${day}/${month}/${year} às ${hour}:${minute}`;
    }

    async function desloga(){
        Keyboard.dismiss()
        await AsyncStorage.clear();
        props.navigation.navigate('Home');
    }

    return(
        <SafeAreaView  
            style={[css.container, css.darkbg, styles.droidSafeArea]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Text style={styles.title}>RANKING</Text>
            <Text style={styles.subtitle}>Código: {eventCode}</Text>
            <Text style={styles.subtitle}>Finalistas: {lengthEventRanking}</Text>
            
                <FlatList
                    style={styles.scrollviewprincipal}
                    data={eventRankingFirsts}
                    keyExtractor={item => item.order.toString()}
                    renderItem={(obj)=>{
                        return (
                            <View style={styles.listItemFirsts(obj.item.order)}>
                                <Text style={styles.listItensName}>#{obj.item.order} - {obj.item.participationName}</Text>    
                                <Text style={styles.listItensEmail}>E-mail: {obj.item.participationEmail}</Text>    
                                <Text style={styles.listItensFinalizadoEm}>Finalizado em: {obj.item.finalizadoEm}</Text>
                            </View>
                            
                        )
                    }}
                /> 
            { lengthEventRanking>3 &&
                <FlatList
                style={styles.scrollview}
                data={eventRankingLasts}
                keyExtractor={item => item.order.toString()}
                renderItem={(obj)=>{
                    return (
                        <View style={styles.listItem}>
                            <Text style={styles.listItensName}>#{obj.item.order} - {obj.item.participationName}</Text>
                            <Text style={styles.listItensEmail}>E-mail: {obj.item.participationEmail}</Text>
                            <Text style={styles.listItensFinalizadoEm}>Finalizado em: {obj.item.finalizadoEm}</Text> 
                            
                        </View>
                        
                    )
                }}
            /> 
            } 

            <TouchableOpacity style={css.login__button} onPress={()=>desloga()}>
                <Text style={css.login__buttonText}>Voltar</Text>
            </TouchableOpacity>


        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    title:{
        fontWeight:"bold",
        paddingBottom: 15,
        textAlign: 'center',
        alignContent: 'flex-start',
        fontSize:40,
        color: "black"
    },
    subtitle:{
        fontWeight:"bold",
        paddingBottom: 10,
        textAlign: 'center',
        alignContent: 'flex-start',
        fontSize:25,
        color: "black"
    },
    listItensName:{
        width: '100%',
        fontWeight:"bold",
        fontSize:18,
        alignSelf: 'center',
        alignContent: 'center',
        paddingTop: 5,
        textAlign: 'left',
        paddingLeft: 15,
    },
    listItensEmail:{
        width: '100%',
        alignSelf: 'center',
        alignContent: 'center',
        paddingBottom: 4,
        fontSize: 12,
        paddingLeft: 15,
        textAlign: 'left'
    },
    listItensFinalizadoEm:{
        width: '100%',
        alignSelf: 'center',
        alignContent: 'center',
        paddingBottom: 10,
        fontSize: 12,
        paddingLeft: 15,
        textAlign: 'left'
    },
    scrollview:{
        width: '100%',
        alignContent: 'center',
        textAlign: 'center'
    },
    scrollviewprincipal:{
        width: '100%',
        height: '80%',
        alignContent: 'center',
        textAlign: 'center'
    },
    droidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 40 : 0
    },
    listItem:{
        backgroundColor: '#cbc8fa',
        width: '80%',
        alignSelf: 'center',
        alignContent: 'center',
        marginVertical: 6,
        borderRadius: 7
    },
    listItemFirsts:(color=0)=>({
        backgroundColor: color==1? '#FFD700': color==2? '#C0C0C0':'#cd7f32',
        width: '80%',
        alignSelf: 'center',
        alignContent: 'center',
        marginVertical: 6,
        borderRadius: 7
    })
})