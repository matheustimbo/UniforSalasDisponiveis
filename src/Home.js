/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  LayoutAnimation,
  TextInput
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import firebase from "react-native-firebase"
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { G, Svg, Path } from "react-native-svg"

const { height, width } = Dimensions.get("window")

var CustomLayoutLinear = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.curveEaseInEaseOut,
  },
};

export default class Home extends React.Component {

  constructor(){
    super();
    this.state = {
      blocos: [],
      textinputText: "",
      searchExpanded: false
    }
  }

  componentDidMount(){

    var blocosRef = firebase.database().ref("blocos/")
    blocosRef.on("value", snapshot=>{
      if(snapshot){
        var blocos = []
        snapshot.forEach((blocoSnapshot)=>{
          var salas = []
          var blocoAux = blocoSnapshot.val()

          blocoSnapshot.forEach((sala)=>{
            var salaAux = []
            salaAux.key = sala.key
            salas.push(salaAux)
          })
          blocoAux.key = blocoSnapshot.key
          blocoAux.salas = []
          blocoAux.expanded = false
          console.log("blocosnapshot")
          console.log(blocoSnapshot)
          blocoSnapshot.forEach((sala)=>{
            console.log("sala do snapshot")
            console.log(sala)
            sala.forEach((salaMesmo)=>{
              console.log("salaMesmo")
              console.log(salaMesmo.val())
              var salaMesmoAux = salaMesmo.val()
              salaMesmoAux.key = salaMesmo.key
              blocoAux.salas.push(salaMesmoAux)
            })
            
          })
          blocos.push(blocoAux)
        })
        this.setState({blocos})
        console.log('state blocos')
        console.log(this.state.blocos)
      }
    })
  }
  
  render(){
      return (
          <>
            <StatusBar barStyle="light-content" />
            <TouchableWithoutFeedback
              onPress={()=>{
                LayoutAnimation.configureNext(CustomLayoutLinear);
                this.setState({searchExpanded: false})
              }}
            >
              <View style={{backgroundColor: '#F5F6FA', flex: 1}}>
                <View style={{flex: 1}}>
                  <View style={styles.topBar}>
                    <View style={styles.minibarsContainers}>
                      <View style={styles.minibar}/>
                      <View style={styles.minibar}/>
                      <View style={styles.minibar}/>
                    </View>
                  </View>
                  <LinearGradient colors={['#0073C2', '#2783c2']} style={styles.backgroundArc}>
                    
                  </LinearGradient>
                  <View style={{position: 'absolute', flex: 1, left: 0, top: 0, backgroundColor: 'transparent'}}>
                    <ScrollView style={{
                    width: width,
                    height: height 
                  }}>
                    <View style={{height: (42 + height*0.1 + getStatusBarHeight())/2}}/>
                    <View style={{width: width*0.8, alignSelf: 'center', alignItems: 'flex-end'}}>
                      <TouchableOpacity
                        onPress={()=>{
                          LayoutAnimation.configureNext(CustomLayoutLinear);
                          this.setState({searchExpanded: !this.state.searchExpanded})
                        }}
                      >
                      
                        <View style={[this.state.searchExpanded ? styles.textInputWrap : styles.hidedTextInputWrap]}>
                          <View style={[styles.svgWrap, !this.state.searchExpanded && {marginLeft: 0}]}>
                            <Svg fill="#B1B3B7" id="Capa_1" enable-background="new 0 0 515.558 515.558" height="24" viewBox="0 0 515.558 515.558" width="24" xmlns="http://www.w3.org/2000/svg">
                              <Path d="m378.344 332.78c25.37-34.645 40.545-77.2 40.545-123.333 0-115.484-93.961-209.445-209.445-209.445s-209.444 93.961-209.444 209.445 93.961 209.445 209.445 209.445c46.133 0 88.692-15.177 123.337-40.547l137.212 137.212 45.564-45.564c0-.001-137.214-137.213-137.214-137.213zm-168.899 21.667c-79.958 0-145-65.042-145-145s65.042-145 145-145 145 65.042 145 145-65.043 145-145 145z"/>
                            </Svg>
                            
                          </View>
                          {this.state.searchExpanded &&
                            <View style={{position: 'absolute', flex: 1, top: 0, left: 0}}>
                              <TextInput 
                                style={styles.textinput}
                                placeholder="Filtrar por um bloco"
                                onChangeText={textinputText => this.setState({textinputText})}
                              />
                            </View>
                          }
                          
                          
                        </View>
                      </TouchableOpacity>
                    </View>
                    {this.state.blocos.map((bloco, index)=>{
                      if(this.state.textinputText == "" || (bloco.key.toUpperCase() == this.state.textinputText[0]))
                      return(
                        <TouchableOpacity
                          onPress={()=>{
                            var blocos = this.state.blocos
                            console.log(blocos[index])
                            blocos[index].expanded = !blocos[index].expanded
                            //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                            LayoutAnimation.configureNext(CustomLayoutLinear);
                            this.setState({blocos})
                          }}
                        >
                          <View style={[styles.blocoWrap, bloco.expanded ? {} : { }]}>
                          <Text style={[styles.blocoTitle, bloco.expanded && {marginBottom: 12}]}>Bloco {bloco.key.toUpperCase()}</Text>
                          
                          {bloco.expanded && bloco.salas.map((sala)=>{
                            var tintColor = sala.red ? '#e81a13': sala.blue ? '#3458eb' : '#12a31a'
                            var secondTintColor = sala.red ? '#e34944': sala.blue ? '#5571e6' : '#44ab4a'
                            var disponibilidade = sala.red ? 'Em aula': sala.blue ? 'Em manutenção' : 'Disponível'
                            return(
                              <View style={[styles.salaWrap, {backgroundColor: secondTintColor}]}>
                                <View style={[styles.disponibility, {backgroundColor: tintColor}]}>
                                  <Text style={styles.salaTitle}>{bloco.key.toUpperCase()}{sala.key} </Text>
                                </View>
                                <Text style={styles.disponibilidadeLabel}>{disponibilidade}</Text>
                                
                              </View>
                            )
                          })}
                          
                          </View>
                        </TouchableOpacity>
                        
                      )
                    })}
                    <View style={{height: (42 + height*0.1 + getStatusBarHeight())}}/>
                    
                    
                  </ScrollView>
                  </View>
                </View>
                
                
              </View>
            </TouchableWithoutFeedback>
            
          </>
      );
    }
  
};

const styles = StyleSheet.create({
  textinput: {
    height: 62,
    width: width*0.8- (24 + 12 + 8),
    marginLeft: (24+12+8)
  },
  svgWrap: {
    marginLeft: 12
  },
  hidedTextInputWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 62, 
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    height: 62,
    borderRadius: 50,
    borderWidth: 0,
    borderColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    marginBottom: 12
  },
  textInputWrap: {
    justifyContent: 'center',
    width: width*0.8, 
    alignSelf: 'center',
    backgroundColor: '#E5E7E9',
    height: 62,
    borderRadius: 28,
    borderWidth: 0,
    borderColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    marginBottom: 12
  },
  salaTitle: {
    marginHorizontal: 12,
    color: 'white',
    fontWeight: '600'
  },
  disponibility:{
    height: 42,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  blocoTitle: {
    textAlign: 'center',
    fontSize: 16
  },
  minibar: {
    height: 4,
    width: 28,
    backgroundColor: 'white',
    borderRadius: 4
  },
  minibarsContainers: {
    height: 36,
    width: 50,
    marginTop: getStatusBarHeight(),
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 8
  },
  topBar: {
    backgroundColor: '#0073C2',
    width: width,
    height: 42 + getStatusBarHeight()
  },
  backgroundArc: {
    height: height*0.1,
    width: width,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50
  },
  disponibilidadeLabel: {
    marginLeft: 8,
    color: 'white',
    fontSize: 14,
    fontWeight: "500"
  },
  disponibilidade:{
    width: 10,
    height: 10,
    borderRadius: 50,
    marginLeft: 8
  },
  salaWrap:{
    backgroundColor: '#EBEBEB',
    marginVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  blocoWrap: {
    width: width*0.8,
    marginVertical: 12,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  }
});
