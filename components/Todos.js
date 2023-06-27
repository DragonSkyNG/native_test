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

export default function Todos() {
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
      <View style={styles.inputBox}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 2, width: "100%", alignItems: "center" },
  inputBox: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
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
});
