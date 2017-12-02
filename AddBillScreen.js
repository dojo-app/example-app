import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker'

import {
  Container,
  Header,
  Content,
  Button,
  Form,
  Item,
  Input,
  Label,
  Left,
  Text,
  CheckBox,
  ListItem,
  Body,
  Thumbnail
} from 'native-base';
import * as firebase from 'firebase';

function removeFalseEntries(obj) {
    let result = {};
    for (const key in obj) {
        if (obj[key]) { //holds a true
            result[key] = true;
        }
    }

    return result;
}

export class AddBillScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Bill',
    headerTintColor: '#c02b2b',
  };

  constructor(props) {
    super(props);
    var users = {};
    for (const user of this.props.screenProps.state.users) {
      users[user.id] = true;
    }

    this.state = {
      billTitle: '',
      billAmount: '$0.00',
      billDescription: '',
      billDueDate: '',
      billUsers: users,
      showToast: false,
      date: '2016-05-15'
    };
  }
  addBill() {
    var key = firebase
      .database()
      .ref('bills')
      .push({
        amount: this.state.billAmount,
        date: this.state.billDueDate,
        description: this.state.billDescription,
        requester: this.props.screenProps.state.user.uid,
        users: this.state.billUsers,
        title: this.state.billTitle
      }).key;
    firebase
      .database()
      .ref('dojos')
      .child(this.props.screenProps.state.dojo)
      .child('bills')
      .update({ [key]: true });
  }

  usersCount() {
    let count = 0;
    for (const user of Object.values(this.state.billUsers)) {
      if (user) count++;
    }
    return count;
  }

  toggleCheck(bool, user){
    if(bool){
      return (
        <Thumbnail
            medium
            source={require('./checkmark.png')}

          />
          );
    }
    else {
      return(
        <Thumbnail
          medium
          source={{ uri: user.photoURL }}
        />
      );
    }

  }

  formatAmount(text){
    var txtLen = text.length-1;
    var check = text;

    if(check.charAt(txtLen) < '0' || check.charAt(txtLen) > '9'){
      check = check.substr(0, txtLen)
    }

    check = check.replace(/[^0-9]/g,'');
    var accounting = require('accounting');
    return accounting.formatMoney(parseFloat(check)/100);



  }

  render() {

    const users = this.props.screenProps.state.users.map(user => (
      <ListItem
        key={user.id}
        onPress={() => {
          var prevUsers = this.state.billUsers;
          prevUsers[user.id] = !prevUsers[user.id];

          //Fix : false ones are not included in the object
          this.setState({
            billUsers: removeFalseEntries(prevUsers)
          });
        }}>
        {this.toggleCheck(this.state.billUsers[user.id], user)}
        <Body>
          <Text>{user.name}</Text>
        </Body>
      </ListItem>
    ));

    return (
      <Container>
        <Content>
          <Form>
          <Item fixedLabel>
              <Label>Bill Title</Label>
              <Input
                value={this.state.billTitle}
                onChangeText={text => this.setState({ billTitle: text })}
              />
            </Item>
            <Item fixedLabel>
              <Label>Bill Amount </Label>
              <Input
                style = {styles.right}
                onChangeText={text => this.setState({ billAmount: this.formatAmount(text) })}
                value={this.state.billAmount}

              />
            </Item>
            <Item fixedLabel>
              <Label>Bill Description</Label>
              <Input
                value={this.state.billDescription}
                onChangeText={text => this.setState({ billDescription: text })}
              />
            </Item>
            <Item fixedLabel>
              <Label>Bill Due Date</Label>
              <Input
                value={this.state.billDueDate}
                onChangeText={text => this.setState({ billDueDate: text })}
              />
              <DatePicker
         style={{width: 250}}
         date={this.state.date}
         mode="date"
         placeholder="select date"
         format="YYYY-MM-DD"
         minDate="2016-05-01"
         maxDate="2016-06-01"
         confirmBtnText="Confirm"
         cancelBtnText="Cancel"
         customStyles={{
           dateIcon: {
             position: 'absolute',
             left: 0,
             top: 4,
             marginLeft: 0
           },
           dateInput: {
             marginLeft: 36
           }
           // ... You can check the source to find the other keys.
         }}
         onDateChange={(date) => {this.setState({date: date})}}
       />
            </Item>
            <ListItem itemDivider>
              <Body>
                <Text>Users</Text>
              </Body>
            </ListItem>
            {users}
          </Form>
          <Button
            full
            onPress={() => {
              console.log('usercount = ' + this.usersCount());
              if (this.state.billTitle === '') {
                Alert.alert('Submission Failed', 'Title cannot be empty.');
              } else if (this.billAmount === '$0.00') {
                Alert.alert(
                  'Submission Failed',
                  'Your Bill Amount cannot be $0.00'
                );
              }  else if (this.usersCount() === 0) {
                Alert.alert(
                  'Submission Failed',
                  'At least one user must be involved.'
                );
              } else {
                this.addBill();
                this.props.navigation.goBack();
              }
            }}>
            <Text>Submit</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  right: {
    marginRight:20,
    textAlign: 'right' ,
  }
});

