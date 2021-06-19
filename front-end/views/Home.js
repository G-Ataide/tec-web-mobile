import React, {useEffect} from 'react';
import { View,Text, Button, TouchableOpacity, Image } from 'react-native';
import {css} from '../assets/css/Css';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Home(props){

    useEffect(()=>{
        async function clearAsyncStorage(){
            await AsyncStorage.clear();
        }
        clearAsyncStorage();
    },[]);


    return(
        <View style={[css.container, css.darkbg]}>

            <View style={css.login__logomarca_principal}>
                <Image source={require('../assets/img/logomarca.png')}/>
            </View>

            

            <TouchableOpacity style={css.login__button} onPress={()=>props.navigation.navigate('CriarEvento')}>
                <Text style={css.login__buttonText}>Criar Evento</Text>
            </TouchableOpacity>

            <TouchableOpacity style={css.login__button} onPress={()=>props.navigation.navigate('ProcurarEvento')}>
                <Text style={css.login__buttonText}>Procurar Evento</Text>
            </TouchableOpacity>

            <TouchableOpacity style={css.login__button} onPress={()=>props.navigation.navigate('ProcurarRanking')}>
                <Text style={css.login__buttonText}>Ranking</Text>
            </TouchableOpacity>
        </View>
    );
}

