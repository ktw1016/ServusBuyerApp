import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import StarRating from "react-native-star-rating";
import Moment from 'moment';
const fetch = require("node-fetch");


class ReviewOrder extends Component {
  constructor(props) {
    super(props);

    const serviceInfo = this.props.navigation.getParam(
      "serviceInfo", "NO-SERVICE"
    );
    const selectedTime = this.props.navigation.getParam(
      "selectedTime", "NO-TIMESELECTED"
    );
    const taskSize = this.props.navigation.getParam(
      "taskSize", "NO-TASKSIZE"
    );
    const selectedDay = this.props.navigation.getParam(
      "selectedDay", "NO-SELECTEDDAY"
    );
    const sellerPhoto = this.props.navigation.getParam('sellerPhoto', 'NO-NAME');

    let taskSizeHr = 0;
    if (taskSize == 'SM') {
      taskSizeHr = 1;
    } else if (taskSize == 'MD') {
      taskSizeHr = 2;
    } else if (taskSize == 'LG') {
      taskSizeHr = 3;
    } else if (taskSize == 'XL') {
      taskSizeHr = 4;
    }
    this.state = {
      taskSizeHr: taskSizeHr,
      taskSize: taskSize,
      selectedTime: selectedTime,
      serviceInfo: serviceInfo,
      selectedDay: selectedDay,
      paymentInfo: '',
      noteToSeller: null,
      sellerPhoto: sellerPhoto
    };
  }

  formatTime(shift) {
    return `${Moment(shift.startHour).format("HH:mm")} - ${Moment(shift.endHour).format("HH:mm")}`;
  }

  setPaymentInfo(paymentInfo) {
    this.setState({ paymentInfo: paymentInfo });
  }

  getPaymentInfo() {
    this.props.navigation.navigate("PaymentInfo", {
      setPaymentInfo: this.setPaymentInfo.bind(this)
    });
  }

  sendNotificationToSeller(orderId) {

    fetch(`http://localhost:8080/api/getAccountInfo?type=${'sellers'}&id=${this.state.serviceInfo[0].sellerID}`)
      .then((response) => response.json())
      .then((responseJson) => {
        fetch(`https://fcm.googleapis.com/fcm/send`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAHyv-GIg:APA91bFcrY4DEMCl5SyfH4V8kjehp20BVYo7Ly5CQj5D5IJUSEQ6TKOl0cvlywN5wFdxgXBCTfCkxrR0z0iBCyhrdMnjYurwcAyu2MJU5Eq-BuX7gHojKCMb1TsQlJIYfx8_oDI5YND5'
          },
          body: JSON.stringify({
            "to": responseJson.fcmToken,
            "notification": {
              "title": "You have a new order request!",
              "body": "Head to your orders to review it",
              "content_available": true,
              "priority": "high"
            },
            "data": {
              "title": "You have a new order request!",
              "body": "Head to your orders to review it",
              "orderId": orderId,
              "content_available": true,
              "priority": "high"
            }
          })
        })
          .then(response => response.json())
          .then(responseJson => {
            console.log(responseJson);
          })
          .catch(error => {
            console.log(error);
          });
      })


  }

  placeOrder() {
    // place stripe order
    // figure out where to navigate and what to do
    AsyncStorage.getItem("userId", (err, result) => {
      fetch('http://localhost:8080/api/purchaseService?id=' + result, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: this.state.serviceInfo[0].id,
          sellerId: this.state.serviceInfo[0].sellerID,
          sellerName: this.state.serviceInfo[0].sellerName,
          serviceCategory: this.state.serviceInfo[0].serviceCategory,
          serviceName: this.state.serviceInfo[0].serviceName,
          serviceDescription: this.state.serviceInfo[0].serviceDescription,
          selectedTime: this.state.selectedTime,
          selectedDay: this.state.selectedDay.dateString,
          note: this.state.noteToSeller,
          taskSize: this.state.taskSize,
          price: this.state.serviceInfo[0].priceHr
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          this.sendNotificationToSeller(responseJson.orderId);
        })
        .catch(error => {
          console.log(error);
        });;
    });

    // do a check to make sure the order was processed?
    this.props.navigation.navigate('ServiceOrdered');


  }

  render() {
    const { navigation } = this.props;

    return (
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={-200} 
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{
            flexDirection: "row",
            padding: 10,
            paddingBottom: 5,
            borderBottomColor: "#dfe6e9",
            borderBottomWidth: 2,
          }}>

            <View
              style={{
                flex: 1,
                flexDirection: "column",
                marginLeft: 20,
                paddingBottom: 10
              }}
            >
              <Text style={{ fontSize: 30, color: "#000" }}>
                {this.state.serviceInfo[0].sellerName}
              </Text>
              <Text style={{ fontSize: 15 }}>
                {this.state.serviceInfo[0].serviceCategory} Service
            </Text>
              <View style={{ width: 100, paddingTop: 10 }}>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={4.5}
                  starSize={16}
                  fullStarColor="orange"
                  emptyStarColor="orange"
                  style={{}}
                />
              </View>
            </View>
            {
            this.state.sellerPhoto ?
              <Image
                source={{ uri: this.state.sellerPhoto }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 55
                }}
              />
          : <Icon name="user-circle" size={83} />
          }
          </View>

      


        <View style={{ margin: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom:20}}>Review Your Order</Text>

          <View style={{ marginLeft: 20 }}>

            <View style={{ paddingBottom: 15 }}>
            
              <Text style={{ fontSize: 14, color: '#7f8c8d', paddingBottom: 10, marginTop:0 }}>Service</Text>
              <View style={{ marginLeft: 30, paddingBottom:20 }}>
                <Text style={{ fontSize: 18 }}>{this.state.serviceInfo[0].serviceName}</Text>
                <Text style={{ fontSize: 18 }}>{this.state.serviceInfo[0].serviceCategory}</Text>
              </View>

              <Text style={{ fontSize: 14, color: '#7f8c8d', paddingBottom: 10, marginTop:0 }}>Date</Text>
                <View style={{ marginLeft: 30 }}>
                  <Text style={{ fontSize: 18 }}>{Moment(this.state.selectedDay.dateString).format('LL')}</Text>
                  <Text style={{ fontSize: 18 }}>{this.state.selectedTime}</Text>
                </View>

              <Text style={{ fontSize: 14, color: '#7f8c8d', paddingBottom: 10, marginTop:10 }}>Payment</Text>
              <View style={{ paddingBottom: 15, borderBottomWidth: 2, borderBottomColor: '#dfe6e9' }}>
                <View style={{ marginLeft: 30 }}>
                  {this.state.paymentInfo != '' && <Text style={{ fontSize: 18 }}>{this.state.paymentInfo.brand}</Text>}
                  {this.state.paymentInfo == '' && <Text onPress={() => this.getPaymentInfo()} style={{ fontSize: 18 }}>Select Payment Info</Text>}
                </View>
              </View>

              <View style={{ marginTop: 40, paddingBottom: 15 }}>
                <Text style={{ fontSize: 20 }}>Estimated Duration: {this.state.taskSizeHr} hours</Text>
                <Text style={{ fontSize: 20 }}>Estimated Cost: ${this.state.taskSizeHr * this.state.serviceInfo[0].priceHr}</Text>
              </View>

              <TextInput style={{fontSize:20}}onChangeText={(text) => this.setState({ noteToSeller: text })} placeholder="Add a note.." />
            </View>

          </View>
        </View>


          <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity
              style={st.btnPrimary}
              onPress={() => this.placeOrder()}>
              <Text style={st.btnText}>PLACE ORDER</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

    );
  }



}

const st = require("../styles/style.js");
const styles = StyleSheet.create({});

export default ReviewOrder;