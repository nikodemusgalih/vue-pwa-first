<template>
    <div>
      <div>
        <h5>Name added: {{ addedData }}</h5>
        <input v-model="nameAdd" placeholder="Your name" />
      
        <p>Age added: {{ addedData }}</p>
        <input v-model="ageAdd" placeholder="Your Age" />
      
        <p>Email added: {{ addedData }}</p>
        <input v-model="emailAdd" placeholder="Your email" />
      
        <button @click="addData(nameAdd, ageAdd, emailAdd)">Add Data</button>
      </div>

      <button @click="showAddData">Add Data</button>
      <button @click="readData">Read Data</button>
      <button @click="updateData">Update Data</button>
      <button @click="deleteData">Delete Data</button>
      <ul>
        <li v-for="customer in customers" :key="customer.ssn">
          {{ customer.name }} - {{ customer.email }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  let primaryKey =1
  const dbName = "the_name";
  // const customerToAdd = { ssn: "666-66-6666", name: "Alice", age: 28, email: "alice@example.com" };
  const keyToUpdate = "666-66-6666";
  const updatedCustomerData = { ssn: "666-66-6666", name: "Alice Updated", age: 30, email: "alice.updated@example.com" };
  const keyToDelete = "666-66-6666";
  
  let isAddData = false;
  let isReadData = false;
  let isUpdateData = false;
  let isDeleteData = false;

  const addedData = ref(null);
  const updatedData = ref(null);
  const deletedData = ref(null);
  const customers = ref([]);
  
  const showAddData = () => {isAddData=true;isReadData=false;isUpdateData=false;isDeleteData=false;log();}
  const showReadData = () => {isAddData=false;isReadData=true;isUpdateData=false;isDeleteData=false;log();}
  const showUpdateData = () => {isAddData=false;isReadData=false;isUpdateData=true;isDeleteData=false;log();}
  const showDeleteData = () => {isAddData=fasle;isReadData=false;isUpdateData=false;isDeleteData=true;log();}

  const log = () =>{
    console.log('isAddData : ' + isAddData);
    console.log('isReadData : ' + isReadData);
    console.log('isUpdateData : ' + isUpdateData);
    console.log('isDeleteData : ' + isDeleteData);
  }
  const addData = (name, age, email) => {
    console.log('name : ' + name)
    const customerToAdd = { ssn: primaryKey, name: name, age: age, email: email };
    primaryKey = primaryKey+1;
    const request = indexedDB.open(dbName, 2);
  
    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
    };
  
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
  
      const objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("email", "email", { unique: true });
    };
  
    request.onsuccess = (event) => {
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
    };
  };
  
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
          // customers.value.push(cursor.value);
          console.log('customers.value:', customers.value)
          customers.value.splice(cursor.value.index, 1, cursor.value);
          cursor.continue();
        } else {
          console.log("Data read successfully");
          // customers.value.splice(0, customers.value.length);
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