import React, { Component } from "react";
import HomeView from './views/appViews/HomeView.js';
import firebase from 'react-native-firebase';
import {
    AsyncStorage,
    View,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView
} from "react-native";
import Svg, {
    Path,
    Circle
} from 'react-native-svg';
import { Rating, AirbnbRating } from 'react-native-ratings';

const WIDTH = Dimensions.get('screen').width;

class RateSeller extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderInfo: null,
            tip: 3,
            rating: null
        }
    };

    componentDidMount() {
        const { navigation } = this.props;
        //const orderId = JSON.parse(JSON.stringify(navigation.getParam('orderId', 'NO-ORDER')));

        fetch(`http://localhost:8080/api/viewOrder?id=15`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ orderInfo: responseJson.order[0] })
                console.log(responseJson.order[0])
            })
    }

    ratingCompleted = (rating) => {
        console.log(rating);
        this.setState({ rating: rating });
    }

    selectTip = (tip) => {

        this.setState({ tip: parseFloat(tip, 10) });
    }

    getSelectedTip = (tip) => {
        if (parseFloat(tip, 10) == this.state.tip) {
            return {
                marginLeft: 20, width: 35, height: 35, borderRadius: 35, backgroundColor: '#E88D72', justifyContent: 'center', alignItems: 'center', shadowColor: 'black',
                shadowOffset: {
                    width: 0,
                    height: 5
                },
                shadowRadius: 5,
                shadowOpacity: 1.0,
                elevation: 10,
                borderWidth: 4,
                borderColor: '#d17f66',
                flex: 1
            }
        } else {
            return {
                flex: 1, marginLeft: 20, width: 35, height: 35, borderRadius: 35, backgroundColor: '#E88D72', justifyContent: 'center', alignItems: 'center'
            }
        }
    }

    completeService = () => {

        //update ratings table
        fetch(`http://localhost:8080/api/addRating?sellerId=${this.state.orderInfo.sellerId}&serviceId=${this.state.orderInfo.serviceId}&orderId=${this.state.orderInfo.id}&buyerId=${this.state.orderInfo.buyerId}&rating=${this.state.rating}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .catch((error) => {
                console.error(error);
            });


        this.props.navigation.navigate('Home');
    }

    render() {
        if (this.state.orderInfo) {
            return (
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={100}>

                    <View>
                        <Svg height={300} width={WIDTH}>
                            <Circle
                                cx={WIDTH / 2}
                                cy={`-${898 - 170 + 2}`}
                                r="898.5"
                                fill="#E88D72"
                                stroke="#dfe6e9"
                                strokeWidth="2"
                            />
                        </Svg>
                        <Image
                            source={require("../image/avatar1.jpg")}
                            style={{
                                position: 'absolute',
                                top: 100,
                                left: WIDTH / 2 - 60,
                                width: 120,
                                height: 120,
                                borderRadius: 75
                            }}
                        />
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', marginTop: 30 }}>
                            <Text style={{ fontSize: 30, color: "#000", textAlign: 'center' }}>
                                {this.state.orderInfo.sellerName}
                            </Text>
                            <Text>
                                {this.state.orderInfo.service}
                            </Text>
                        </View>

                        <View>
                            <Text style={{ marginLeft: 20, fontWeight: 'bold', paddingBottom: 10 }}>Rate your seller</Text>

                            <View style={{ alignItems: 'flex-start', paddingLeft: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <AirbnbRating
                                    count={5}
                                    reviews={["1 - Terrible", "2 - Bad", "3 - Okay", "4 - Good", "5 - Great"]}
                                    defaultRating={3}
                                    size={30}
                                    onFinishRating={this.ratingCompleted}
                                    showRating={false}
                                />
                                <View style={{ marginRight: 80, paddingTop: 3 }}><Text style={{ fontSize: 20 }}>{this.state.rating} / 5</Text></View>
                            </View>
                        </View>

                        <View style={{ marginTop: 20, marginBottom: 20, borderBottomColor: "#dfe6e9", borderBottomWidth: 2, }} />

                        <View style={{ marginLeft: 20 }}>
                            <Text style={{ fontWeight: 'bold', paddingBottom: 15 }}>Add a tip (optional)</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.selectTip(2)} style={this.getSelectedTip(2)}>
                                    <Text style={{ color: '#fff', fontSize: 22 }}>$2</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.selectTip(4)} style={this.getSelectedTip(4)}>
                                    <Text style={{ color: '#fff', fontSize: 21 }}>$4</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.selectTip(6)} style={this.getSelectedTip(6)}>
                                    <Text style={{ color: '#fff', fontSize: 22 }}>$6</Text>
                                </TouchableOpacity>
                                <View style={{ marginLeft: 20, flex: 2, marginTop: -17 }}>
                                    <TextInput keyboardType='numeric' onChangeText={text => this.selectTip(text)} placeholder='Other' style={{ width: 100, fontSize: 20, borderColor: '#E88D72', borderBottomWidth: 2 }}></TextInput>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 25, marginBottom: 20, borderBottomColor: "#dfe6e9", borderBottomWidth: 2, }} />

                        <View style={{ marginLeft: 80 }}>
                            <View style={{ width: 250, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 20 }}>Service:</Text>
                                    <Text style={{ fontSize: 20 }}>Tip:</Text>
                                    <Text style={{ fontSize: 20 }}>Total:</Text>
                                </View>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 20 }}>${this.state.orderInfo.totalCost}</Text>
                                    <Text style={{ fontSize: 20 }}>${this.state.tip}</Text>
                                    <Text style={{ fontSize: 20 }}>${this.state.orderInfo.totalCost + this.state.tip}</Text>
                                </View>
                            </View>

                        </View>


                        <View style={{alignItems:'center', marginTop:30}}>
                            <TouchableOpacity
                                style={st.btn}
                                onPress={() => this.completeService()}
                            >
                                <Text style={st.btnText}>Submit</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </KeyboardAvoidingView>

            )
        } else {
            return (
                <View><Text>Something went wrong</Text></View>
            )
        }
    }
}

const st = require("../styles/style.js");


export default RateSeller;