import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";

async function saveData(key, data) {
  await SecureStore.setItemAsync(key, JSON.stringify(data));
}

async function getData(key) {
  let result = await SecureStore.getItemAsync(key);
  return JSON.parse(result) || false;
}

async function purge(key) {
  await SecureStore.deleteItemAsync(key);
}

export default function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const unqID = useRef(0);

  useEffect(() => {
    const getStoredData = async () => {
      // await purge("todos");
      // await purge("id");
      let storedTodos = await getData("todos");
      let storedID = await getData("id");
      unqID.current = storedID ? storedID : 0;
      setTodos(storedTodos ? storedTodos : []);
      console.log(storedTodos);
      console.log(storedID);
    };
    getStoredData();
  }, []);

  useEffect(() => {
    const saveDataToStore = async () => {
      await saveData("todos", todos);
      await saveData("id", unqID.current);
    };
    saveDataToStore();
  }, [todos]);

  const addTodoHandler = () => {
    setTodos((prevTodos) => [...prevTodos, { id: unqID.current, todo: todo }]);
    unqID.current += 1;
    setTodo("");
  };

  const deleteTodoHandler = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    if (todos.length - 1 === 0) {
      purge("id");
      unqID.current = 0;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Header section</Text>
        <TextInput
          style={styles.input}
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
        renderItem={({ item }) => (
          <Text
            style={{ fontSize: 20 }}
            onPress={() => {
              deleteTodoHandler(item.id);
            }}
          >
            {item.todo}
          </Text>
        )}
      />
      <View style={styles.footer}>
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
  header: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    width: "100%",
    paddingBottom: 15,
    alignItems: "center",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#55e",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    minWidth: 100,
    textAlign: "center",
  },
  footer: {
    borderTopColor: "#fff",
    borderTopWidth: 1,
    width: "100%",
    paddingTop: 15,
  },
});
