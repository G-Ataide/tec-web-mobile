import {StyleSheet} from 'react-native'

const css = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    textPage:{
        backgroundColor: 'orange',
        padding: 20
    },
    button__home:{
        alignItems: "center",
        backgroundColor: "#fcd526",
        borderRadius: 15,
        padding: 10,
        margin: 10
    },
    darkbg:{
        backgroundColor:"#6E6D6D"
    },
    login__logomarca:{
        marginBottom: 30,
        marginTop: -100,
        alignItems: 'flex-start',
        alignSelf: 'center'
    },
    login__logomarca_principal:{
        // marginTop: -10,
        marginBottom: 10,
        // alignItems: 'flex-start',
        // alignSelf: 'center'
    },
    login__msg__user__password__invalid:(text='none')=>({
        fontWeight:"bold",
        fontSize:22,
        color:"red",
        marginTop: 10,
        marginBottom: 15,
        display: text
    }),
    login__msg__user__password__empty:(text='none')=>({
        fontWeight:"bold",
        fontSize:22,
        color:"red",
        marginTop: 10,
        marginBottom: 15,
        display: text
    }),
    login__msg__user__already__logged:(text='none')=>({
        fontWeight:"bold",
        fontSize:22,
        color:"red",
        marginTop: 10,
        marginBottom: 15,
        display: text
    }),
    login__form:{
        width: "80%"
    },
    login__input:{
        backgroundColor: "#FFF",
        fontSize: 19,
        padding: 7,
        paddingLeft: 15,
        marginBottom: 15,
        borderRadius: 14
    },
    login__button:{
        margin:20,
        padding: 8,
        width: '70%',
        textAlign: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: "#fcd526",
        alignSelf: "center",
        borderRadius: 14
    },
    login__buttonText:{
        fontWeight:"bold",
        fontSize:22,
        color: "black"        
    },
    area__menu:{
        flexDirection: 'row',
        paddingTop: 40,
        paddingBottom: 10,
        width: '100%',
        backgroundColor:'#393737',
        alignItems:'center',
        justifyContent:'center'
    },
    button__home2:{
        textAlign:'left'
    },
    area__title:{
        width: '80%',
        fontWeight:'bold',
        fontSize:20,
        color:'#fff',
        textAlign:'center'
    },
    button__logout:{
        textAlign:'right'
    },
    qr__code:(display='flex')=>({
        width: '100%',
        height: '100%',
        // backgroundColor: '#000',
        justifyContent: 'center',
        display: display
    })
});

export {css};