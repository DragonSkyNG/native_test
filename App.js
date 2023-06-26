import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

async function saveTodos(todos) {
  await SecureStore.setItemAsync("todos", JSON.stringify(todos));
}

async function getTodos() {
  let result = await SecureStore.getItemAsync("todos");
  return JSON.parse(result) || [];
}

async function purge() {
  await SecureStore.deleteItemAsync("todos");
}

export default function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const doShit = async () => {
      let storedTodos = await getTodos();
      console.log(storedTodos);
      setTodos(storedTodos);
    };
    doShit();
  }, []);

  useEffect(() => {
    const saveShit = async () => {
      await saveTodos(todos);
    };
    saveShit();
  }, [todos]);

  const addTodoHandler = () => {
    setTodos((prevTodos) => [...prevTodos, todo]);
    setTodo("");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          borderBottomColor: "#fff",
          borderBottomWidth: 1,
          width: "100%",
          paddingBottom: 15,
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text>Header section</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#55e",
            borderRadius: 10,
            paddingLeft: 15,
            paddingRight: 15,
            minWidth: 100,
            textAlign: "center",
          }}
          placeholder="To Do"
          onChangeText={setTodo}
          value={todo}
        />
        <Button
          onPress={addTodoHandler}
          disabled={todo.length === 0}
          title="Add Todo"
        />
      </View>
      <FlatList
        style={{ gap: 30 }}
        data={todos}
        renderItem={({ item }) => <Text style={{ fontSize: 20 }}>{item}</Text>}
      />
      <View
        style={{
          borderTopColor: "#fff",
          borderTopWidth: 1,
          width: "100%",
          paddingTop: 15,
        }}
      >
        <Text style={{ textAlign: "center" }}>Footer section</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 25,
    backgroundColor: "#888",
    alignItems: "center",
  },
  scroll: {
    width: "100%",
  },
});
