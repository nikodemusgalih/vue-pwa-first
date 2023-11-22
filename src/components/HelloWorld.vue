<script setup>
import { ref } from 'vue'
const title = ""
const count = ref(0);
let pokemons = ref([]);
const dbName = "the_name";
const customerToAdd = { ssn: "666-66-6666", name: "Alice", age: 28, email: "alice@example.com" };
const keyToUpdate = "666-66-6666";
const updatedCustomerData = { ssn: "666-66-6666", name: "Alice Updated", age: 30, email: "alice.updated@example.com" };
const keyToDelete = "666-66-6666";

const addedData = ref(null);
const updatedData = ref(null);
const deletedData = ref(null);
const customers = ref([]);

const fetchPoke = async () => {
  try {
    const result = await fetch("https://pokeapi.co/api/v2/pokemon") 
    if (result.ok){
      const data = await result.json()
      if (Array.isArray(data.results)) {
        pokemons.value = data.results
      }
    }

    console.log({ pokemons })
  } catch (error) {
    console.log({ error })
  }
}
const addData = () => {
  const request = indexedDB.open("myApp", 1)

  request.error = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    const objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("email", "email", { unique: true });
  };

  request.onsuccess = () => {
    const db = event.target.result;

    const addTransaction = db.transaction("customers", "readwrite");
    const customerObjectStore = addTransaction.objectStore("customers");

    const addRequest = customerObjectStore.add(customerToAdd);

    addRequest.onsuccess = (event) => {
      console.log("Data added successfully");
      addedData.value = "Yes";
    };

    addRequest.onerror = (event) => {
      console.error("Error adding data", event.target.error);
      addedData.value = "No";
    };

    addTransaction.oncomplete = () => {
      console.log("Add transaction completed");
      db.close();
    };
  }
}
const readData = () => {
  const request = indexedDB.open(dbName, 2);

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const readTransaction = db.transaction("customers", "readonly");
    const customerObjectStore = readTransaction.objectStore("customers");

    const customersCursor = customerObjectStore.openCursor();

    customersCursor.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        customers.value.push(cursor.value);
        cursor.continue();
      } else {
        console.log("Data read successfully");
        db.close();
      }
    };

    customersCursor.onerror = (event) => {
      console.error("Error reading data", event.target.error);
      db.close();
    };
  };
};
const updateData = () => {
  const request = indexedDB.open(dbName, 2);

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const updateTransaction = db.transaction("customers", "readwrite");
    const customerObjectStore = updateTransaction.objectStore("customers");

    const updateRequest = customerObjectStore.put(updatedCustomerData);
    const updatedData = ref(null);
    updateRequest.onsuccess = (event) => {
      console.log("Data updated successfully");
      updatedData.value = "Yes";
    };

    updateRequest.onerror = (event) => {
      console.error("Error updating data", event.target.error);
      updatedData.value = "No";
    };

    updateTransaction.oncomplete = () => {
      console.log("Update transaction completed");
      db.close();
    };
  };
};
const deleteData = () => {
  const request = indexedDB.open(dbName, 2);

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const deleteTransaction = db.transaction("customers", "readwrite");
    const deleteObjectStore = deleteTransaction.objectStore("customers");

    const deleteRequest = deleteObjectStore.delete(keyToDelete);

    deleteRequest.onsuccess = (event) => {
      console.log("Data deleted successfully");
      deletedData.value = "Yes";
    };

    deleteRequest.onerror = (event) => {
      console.error("Error deleting data", event.target.error);
      deletedData.value = "No";
    };

    deleteTransaction.oncomplete = () => {
      console.log("Delete transaction completed");
      db.close();
    };
  };
};
</script>

<template>
  <h1>{{ msg }}</h1>
  <p>Data added: {{ addedData }}</p>
  <p>Data updated: {{ updatedData }}</p>
  <p>Data deleted: {{ deletedData }}</p>
  <button @click="addData">Add Data</button>
  <button @click="readData">Read Data</button>
  <button @click="updateData">Update Data</button>
  <button @click="deleteData">Delete Data</button>
    <ul>
      <li v-for="customer in customers" :key="customer.ssn">
        {{ customer.name }} - {{ customer.email }}
      </li>
    </ul>
  <button class="btn btn-secondary" @click="fetchPoke">Fetch</button>
  <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center;">
    <!-- <button type="button" @click="count++">count is {{ count }}</button> -->
    <div div class="card card-side bg-base-100 shadow-xl mr-2 mb-2" v-for="(pokemon, i) in pokemons" :key="i">
      <div class="card-body">
        <h2 class="card-title">{{ pokemon.name }}</h2>
        <p>Click the button to watch on Jetflix app.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
