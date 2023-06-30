import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Alert,
  Pressable,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { FontAwesome } from "@expo/vector-icons";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [strikedIDs, setStrikedIDs] = useState([]);
  const unqID = useRef(0);

  useEffect(() => {
    const getStoredData = async () => {
      let storedTodos = await getData("todos");
      let storedID = await getData("id");
      let storedStrikedIDs = await getData("strikedIDs");
      unqID.current = storedID ? storedID : 0;
      setTodos(storedTodos ? storedTodos : []);
      setStrikedIDs(storedStrikedIDs ? storedStrikedIDs : []);
    };
    getStoredData();
  }, []);

  useEffect(() => {
    const saveDataToStore = async () => {
      await saveData("todos", todos);
      await saveData("id", unqID.current);
      await saveData("strikedIDs", strikedIDs);
    };
    saveDataToStore();
  }, [todos]);

  const addTodoHandler = () => {
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: unqID.current, todo: todo, striked: false },
    ]);
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

  checkTodoHandler = (id) => {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    const modifiedArr = [...todos];
    modifiedArr[todoIndex].striked = !modifiedArr[todoIndex].striked;
    modifiedArr[todoIndex].striked
      ? setStrikedIDs(() => [...strikedIDs, id])
      : setStrikedIDs(() => strikedIDs.filter((item) => item !== id));
    setTodos(() => [...modifiedArr]);
  };

  const clearStrikedTodosHandler = () => {
    setTodos((prevTodos) => {
      const filteredTodos = prevTodos.filter((todo) => {
        for (id of strikedIDs) {
          if (todo.id === id) {
            return false;
          }
        }
        return true;
      });
      return filteredTodos;
    });
    setStrikedIDs([]);
  };

  const purgeAllTodosHandler = async () => {
    await purge("todos");
    await purge("id");
    await purge("strikedIDs");
    setTodos([]);
    setStrikedIDs([]);
    unqID.current = 0;
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        <View style={styles.modal}>
          <View style={styles.card}>
            <Text style={{ paddingBottom: 10, fontSize: 20 }}>
              Do you want to purge all todos?
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button
                onPress={() => {
                  purgeAllTodosHandler();
                  setModalVisible(false);
                }}
                title="Yes"
              />
              <Button
                onPress={() => {
                  setModalVisible(false);
                }}
                title="No"
              />
            </View>
          </View>
        </View>
      </Modal>
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
          style={styles.button}
          title="Add Todo"
        />
      </View>

      <FlatList
        style={styles.list}
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text
              style={[styles.todo, item.striked && styles.striked]}
              onPress={() => {
                checkTodoHandler(item.id);
              }}
            >
              {item.todo}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.listButton,
                !item.striked && styles.disabled,
                { backgroundColor: pressed ? "#4682F9" : "#rgba(0,0,0,0)" },
              ]}
              onPress={() => deleteTodoHandler(item.id)}
              disabled={!item.striked}
            >
              <FontAwesome
                name="trash-o"
                size={30}
                color={!item.striked ? "gray" : "black"}
              />
            </Pressable>
          </View>
        )}
      />
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
        <Button
          onPress={() => {
            setModalVisible(true);
          }}
          disabled={todos.length === 0}
          title="Purge all todos"
        />
        <Button
          onPress={clearStrikedTodosHandler}
          disabled={strikedIDs.length === 0}
          title="Clear all checked todos"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 2, width: "100%", alignItems: "center" },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputBox: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  button: {
    borderRadius: 100,
  },
  input: {
    color: "#333",
    borderWidth: 1,
    borderColor: "#55e",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    minWidth: 100,
    textAlign: "center",
  },
  list: { width: "100%", marginTop: 10, paddingLeft: 10, paddingRight: 10 },
  listItem: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  todo: {
    flex: 1,
    color: "white",
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
    backgroundColor: "#333",
    borderRadius: 10,
  },
  listButton: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#4682F9",
  },
  disabled: {
    borderColor: "gray",
    backgroundColor: "#000",
    color: "gray",
  },
  striked: {
    textDecorationLine: "line-through",
    color: "green",
    textDecorationColor: "red",
  },
});
