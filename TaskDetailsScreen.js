import React, { Component } from "react";
import { StyleSheet } from "react-native";
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
  Icon,
  ListItem,
  CheckBox,
  View,
  Body,
  Thumbnail
} from "native-base";
import * as firebase from "firebase";
import { Alert } from "react-native";

export class TaskDetailsScreen extends React.Component {
  static navigationOptions = {
    title: "Task Details"
    // headerTintColor: '#c02b2b'
  };

  constructor(props) {
    super(props);
    this.state = {
      task: this.props.navigation.state.params.task
    };
  }

  deleteTask() {
    var key = this.props.navigation.state.params.task.id;

    firebase
      .database()
      .ref("dojos")
      .child(this.props.screenProps.state.dojo)
      .child("tasks")
      .child(key)
      .remove();

    firebase
      .database()
      .ref()
      .child("tasks")
      .child(key)
      .remove();
  }

  render() {
    const taskUsers = this.state.task.users;
    const users = this.props.screenProps.state.users
      .filter(user => taskUsers[user.id])
      .map(user => (
        <ListItem key={user.id}>
          <Thumbnail small source={{ uri: user.photoURL }} />
          <Body>
            <Text>{user.name}</Text>
          </Body>
        </ListItem>
      ));

    // const users = this.props.screenProps.state.users.map(user => (
    //   <ListItem key={user.id}>
    //     <CheckBox
    //       color="#c02b2b"
    //       checked={this.state.taskTarget.users[user.id]}
    //     />
    //     <Body>
    //       <Text>{user.name}</Text>
    //     </Body>
    //   </ListItem>
    // ));
    // const billUsers = this.state.bill.users;
    // const user = this.props.screenProps.state.user;

    // const users = this.props.screenProps.state.users
    //   .filter(user => billUsers[user.id])
    //   .map(user => (
    //     <ListItem key={user.id}>
    //       <Thumbnail small source={{ uri: user.photoURL }} />
    //       <Body>
    //         <Text>{user.name}</Text>
    //       </Body>
    //     </ListItem>
    //   ));

    return (
      <Container style={styles.container}>
        <Content>
          <Form>
            <Item fixedLabel style={styles.inputItem}>
              <Label>Title</Label>
              <Input disabled value={this.state.task.title} />
            </Item>

            <Item fixedLabel style={styles.inputItem}>
              <Label>Description</Label>
              <Input disabled value={this.state.task.description} />
            </Item>

            <Item fixedLabel style={styles.inputItem}>
              <Label>Due Date</Label>
              <Input disabled value={this.state.task.date} />
            </Item>

            <ListItem itemDivider>
              <Body>
                <Text>Users</Text>
              </Body>
            </ListItem>
            {users}
          </Form>

          <View style={styles.container}>
            <Button
              iconLeft
              style={styles.editButton}
              onPress={() =>
                this.props.navigation.navigate("EditTask", {
                  task: this.props.navigation.state.params.task
                })
              }
            >
              <Icon name="ios-create-outline" />
              <Text>Edit Task</Text>
            </Button>

            <Button
              iconLeft
              style={styles.deleteButton}
              onPress={() =>
                Alert.alert(
                  "Are you sure?",
                  "This task will be permanently deleted",
                  [
                    { text: "Cancel" },
                    {
                      text: "Delete",
                      onPress: () => {
                        this.deleteTask();
                        this.props.navigation.goBack();
                      }
                    }
                  ],
                  { cancelable: false }
                )
              }
            >
              <Icon name="ios-trash" />
              <Text>Delete Task</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between"
  },

  deleteButton: {
    backgroundColor: "#c02b2b",
    marginRight: "10%",
    marginTop: 30,
    marginBottom: 10
  },

  editButton: {
    backgroundColor: "#bebebe",
    marginLeft: "10%",
    marginTop: 30,
    marginBottom: 10
  },

  inputItem: {
    marginLeft: 0,
    paddingLeft: 15
  }
});
