import React, {useEffect, useState} from 'react';
import { View,Text,StyleSheet, Button, TouchableOpacity, FlatList, KeyboardAvoidingView, Image, TextInput, Keyboard, Alert} from 'react-native';
import {css} from '../assets/css/Css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import config from '../config/config';

export default function CriarEvento(props){

    const [eventNameInput,setEventNameInput] = useState(null);
    const [eventCreatorInput,setEventCreatorInput] = useState(null);
    const [date, setDate] = useState(new Date(Date.now()));
    const [dateInit, setDateInit] = useState(new Date(Date.now()));
    const [dateEnd, setDateEnd] = useState(new Date(Date.now()));
    const [timestamp, setTimestamp] = useState("");
    const [dateFormatedInit, setDateFormatedInit] = useState(null);
    const [dateFormatedEnd, setDateFormatedEnd] = useState(null);
    const [mode, setMode] = useState('date');

    const [showDataPickerInit, setShowDataPickerInit] = useState(false);
    const [showDataPickerEnd, setShowDataPickerEnd] = useState(false);

    const [eventTipsCount, setEventTipsCount] = useState(0);

    
    const [tipName, setTipName] = useState("");
    const [tipAnswer, setTipAnswer] = useState("");

    const [tipArray, setTipArray] = useState([]);

    
    

    useEffect(()=>{
        async function clearAsyncStorage(){
            await AsyncStorage.clear();
        }
        clearAsyncStorage();

        // console.log(formataData(date.toDateString()));
        setDateFormatedInit(formataData(dateInit.toJSON()));
        setDateFormatedEnd(formataData(dateEnd.toJSON()));







    },[]);

    const onChangeInit = (event, selectedDate) => {
        setShowDataPickerInit(false);
        const currentDate = selectedDate || dateInit;
        if(mode=="date"){
            if(event.type==="set"){
                setDateInit(currentDate);
                setDateFormatedInit(formataData(currentDate.toJSON()));
                setMode('time');
                setShowDataPickerInit(true);
            }
        }else if(mode=="time"){
            setMode('date');
            if(event.type==="set"){
                setMode('date');
                setDateFormatedInit(formataData(selectedDate.toJSON()));
                setTimestamp(selectedDate.toJSON());
                // console.log(formataData(selectedDate.toJSON()));
                // console.log(selectedDate.toJSON());
            }
        }
    };

    const onChangeEnd = (event, selectedDate) => {
        setShowDataPickerEnd(false);
        const currentDate = selectedDate || dateEnd;
        if(mode=="date"){
            if(event.type==="set"){
                setDateEnd(currentDate);
                setDateFormatedEnd(formataData(currentDate.toJSON()));
                setMode('time');
                setShowDataPickerEnd(true);
            }
        }else if(mode=="time"){
            setMode('date');
            if(event.type==="set"){
                setMode('date');
                setDateFormatedEnd(formataData(selectedDate.toJSON()));
                setTimestamp(selectedDate.toJSON());
                // console.log(formataData(selectedDate.toJSON()));
                // console.log(selectedDate.toJSON());
            }
        }
    };

    function formataData(dataString){
        let year = dataString.substring(0,4);
        let month = dataString.substring(5,7);
        let day = dataString.substring(8,10);

        let hour = dataString.substring(11,13);
        let minute = dataString.substring(14,16);

        return `${day}/${month}/${year} às ${hour}:${minute}`;
        // return `${day}/${month}/${year}`;
    }

    function formatDateTimeStamp(dateToFormat){

        // 18/06/2021 às 21:27
        // 2021-06-30T21:54:04.0297531


        

        let year = dateToFormat.substring(6,10);
        let month = dateToFormat.substring(3,5);
        let day = dateToFormat.substring(0,2);

        let hour = dateToFormat.substring(14,16);
        let minute = dateToFormat.substring(17,19);

        return `${year}-${month}-${day}T${hour}:${minute}:00`;
    }


    async function createEvento(){
        if(eventNameInput==null||eventNameInput==""){
            Alert.alert("ERRO","Digite corretamente o Nome do Evento!");
            Keyboard.dismiss();
        }else if(eventCreatorInput==null||eventCreatorInput==""){
            Alert.alert("ERRO","Digite corretamente o Criador do Evento!");
            Keyboard.dismiss();
        }else if(eventTipsCount<1){
            Alert.alert("ERRO","Insira ao menos 1 Pista!");
            Keyboard.dismiss();
        }else{
            let dateTimeStampInit = formatDateTimeStamp(dateFormatedInit)
            let dateTimeStampEnd = formatDateTimeStamp(dateFormatedEnd)

            console.log(dateTimeStampInit)
            console.log(dateTimeStampEnd)


            let response = await fetch(`${config.urlRoot}event/create`,{
                method: 'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: eventNameInput,
                    creatorName: eventCreatorInput,
                    tsStart: dateTimeStampInit,
                    tsEnd: dateTimeStampEnd,
                    tips: tipArray
                })
            });

            let json = await response.json();

            

            

            if (response.status != 201){
                Alert.alert("ERRO",json.message);
            }else{
                let eventInformation = await AsyncStorage.setItem('eventCode',json.code);
                Alert.alert(
                    "SUCESSO",
                    `Evento criado com sucesso, código: ${json.code}`,
                    [
                      { text: "OK", onPress: () => props.navigation.navigate('Ranking') }
                    ]
                );
            }
        }
    }

    function addTip(){
        Keyboard.dismiss();
        // console.log(tipArray);

        if (tipName==""||tipName==null){
            Alert.alert("ERRO","Preencha a dica corretamente!");
        }else if(tipAnswer==""||tipAnswer==null){
            Alert.alert("ERRO","Preencha a resposta corretamente!");
        }else{

            Keyboard.dismiss();
            setTipName("");
            setTipAnswer("");
            var newArray = tipArray.filter(function (el){
                return el.code  == tipAnswer ;
            });
            if(newArray.length>=1){
                Alert.alert("ERRO","A(s) resposta(s) deve(m) ser única(s)!");
            }else{
                tipArray.push({
                    'id': Object.keys(tipArray).length,
                    'description': tipName,
                    'code': tipAnswer
                })
                setTipArray(tipArray);
                setEventTipsCount(Object.keys(tipArray).length);
            }
        }
    }


    return(
        <KeyboardAvoidingView 
            style={[css.container, css.darkbg, styles.droidSafeArea, styles.tela__toda('flex')]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Text style={styles.textStyle}>Evento:</Text>
            <TextInput 
                style={styles.login__input} 
                placeholder="Evento"
                onChangeText={text=>setEventNameInput(text)}
                value={eventNameInput}
            />

            <Text style={styles.textStyle}>Criador:</Text>
            <TextInput 
                style={styles.login__input} 
                placeholder="Criador"
                onChangeText={text=>setEventCreatorInput(text)}
                value={eventCreatorInput}
            />


            <Text style={styles.textStyle}>Inicia em:</Text>
            <TouchableOpacity style={styles.login__button} onPress={()=>setShowDataPickerInit(true)}>
                <Text style={css.login__buttonText}>{dateFormatedInit}</Text>
            </TouchableOpacity>

            <Text style={styles.textStyle}>Finaliza em:</Text>
            <TouchableOpacity style={styles.login__button} onPress={()=>setShowDataPickerEnd(true)}>
                <Text style={css.login__buttonText}>{dateFormatedEnd}</Text>
            </TouchableOpacity>

            



            <Text style={styles.textStyle}>Pistas:</Text>

            {eventTipsCount > 0 && <FlatList
                    style={styles.scrollview}
                    data={tipArray}
                    keyExtractor={item => item.id.toString()}
                    renderItem={(obj)=>{
                        return (
                            <View style={styles.listItem}>
                                <Text style={styles.listItensName}>Dica: {obj.item.description}</Text>
                                <Text style={styles.listItensEmail}>Resposta: {obj.item.code}</Text>
                            </View>
                            
                            
                        )
                    }}

                />  }

            <TextInput 
                style={styles.login__input} 
                placeholder="Pista"
                onChangeText={text=>setTipName(text)}
                value={tipName}
            />
            <TextInput 
                style={styles.login__input} 
                placeholder="Resposta"
                onChangeText={text=>setTipAnswer(text)}
                value={tipAnswer}
            />



            <TouchableOpacity style={styles.login__button__pista} onPress={()=>addTip()}>
                <Text style={css.login__buttonText}>Adicionar Pista</Text>
            </TouchableOpacity>

            {showDataPickerInit && <DateTimePicker
                value={dateInit}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChangeInit}
                timeZoneOffsetInMinutes={0}
            />}

            {showDataPickerEnd && <DateTimePicker
                value={dateEnd}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChangeEnd}
                timeZoneOffsetInMinutes={0}
            />}


            <TouchableOpacity style={css.login__button} onPress={()=>createEvento()}>
                <Text style={css.login__buttonText}>Criar Evento</Text>
            </TouchableOpacity>

            
        </KeyboardAvoidingView>
    );
}



const styles = StyleSheet.create({
    listItem:{
        backgroundColor: '#cbc8fa',
        width: '70%',
        alignSelf: 'center',
        alignContent: 'center',
        marginVertical: 6,
        borderRadius: 7
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
    scrollview:{
        width: '100%',
        alignContent: 'center',
        textAlign: 'center',
        marginBottom: 15,
    },
    login__button__pista:{
        margin:10,
        padding: 8,
        // width: '50%',
        textAlign: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: "#fcd526",
        alignSelf: "center",
        borderRadius: 14
    },
    textStyle:{
        textAlign: 'left',
        width: "75%",
        paddingLeft: 10,
        marginBottom: 4,
    },
    droidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 35 : 0
    },
    tela__toda:(display='flex')=>({
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
        display: display
    }),
    login__button:{
        marginBottom:15,
        padding: 8,
        width: '75%',
        textAlign: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: "#FFF",
        alignSelf: "center",
        borderRadius: 10
    },
    login__input:{
        width: '75%',
        backgroundColor: "#FFF",
        fontSize: 19,
        padding: 7,
        paddingLeft: 15,
        marginBottom: 15,
        borderRadius: 10
    },
})