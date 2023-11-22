<template>
    <div>
      <input type="file" @change="handleFileUpload" />
      <button @click="showStoredImage">Show Stored Image</button>
      <div v-if="storedImage">
        <img :src="storedImage" alt="Stored Image" />
        <button @click="updateStoredImage">Update Image</button>
        <button @click="deleteStoredImage">Delete Image</button>
      </div>
    </div>
  </template>
   
  <script>
  export default {
    data() {
      return {
        storedImage: null,
        db: null,
      };
    },
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
   
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target.result;
          this.storeImageInIndexedDB(imageData, file.type);
        };
        reader.readAsArrayBuffer(file);
      },
      storeImageInIndexedDB(imageData, fileType) {
        const dbName = 'YourDBName';
        const storeName = 'YourStoreName';
    
        const request = indexedDB.open(dbName, 1);
   
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          }
        };
   
        request.onsuccess = (event) => {
          this.db = event.target.result;
          const transaction = this.db.transaction(storeName, 'readwrite');
          const objectStore = transaction.objectStore(storeName);
   
          const blob = new Blob([imageData], { type: fileType });
   
          const newItem = { image: blob };
          const addRequest = objectStore.add(newItem);
   
          addRequest.onsuccess = () => {
            console.log('Image stored in IndexedDB successfully');
            this.showPopup('Image stored successfully!');
          };
   
          addRequest.onerror = (error) => {
            console.error('Error storing image in IndexedDB', error);
            this.showPopup('Error storing image in IndexedDB');
          };
        };
   
        request.onerror = (error) => {
          console.error('Error opening IndexedDB', error);
          this.showPopup('Error opening IndexedDB');
        };
      },
      showPopup(message) {
        window.alert(message);
        // You can replace window.alert with your preferred popup library or component
      },
      showStoredImage() {
        this.retrieveImageFromIndexedDB();
      },
      retrieveImageFromIndexedDB() {
        const storeName = 'YourStoreName';
   
        const transaction = this.db.transaction(storeName, 'readonly');
        const objectStore = transaction.objectStore(storeName);
   
        const getRequest = objectStore.getAll();
   
        getRequest.onsuccess = () => {
          const images = getRequest.result;
          if (images.length > 0) {
            // Assuming the first image is the one you want to display
            const blob = images[0].image;
            const imageUrl = URL.createObjectURL(blob);
            this.storedImage = imageUrl;
          } else {
            this.showPopup('No image found in IndexedDB');
          }
        };
   
        getRequest.onerror = (error) => {
          console.error('Error retrieving image from IndexedDB', error);
          this.showPopup('Error retrieving image from IndexedDB');
        };
      },
      updateStoredImage() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', (event) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageData = event.target.result;
            this.updateImageInIndexedDB(imageData);
          };
          reader.readAsArrayBuffer(file);
        });
  fileInput.click();
      },
      updateImageInIndexedDB(imageData) {
        const storeName = 'YourStoreName';
   
        const transaction = this.db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);
   
        const blob = new Blob([imageData], { type: 'image/*' });
   
        const getRequest = objectStore.getAll();
   
        getRequest.onsuccess = () => {
          const images = getRequest.result;
          if (images.length > 0) {
            const itemId = images[0].id;
            const updateRequest = objectStore.put({ id: itemId, image: blob });
   
            updateRequest.onsuccess = () => {
              console.log('Image updated in IndexedDB successfully');
              this.showPopup('Image updated successfully!');
            };
   
            updateRequest.onerror = (error) => {
              console.error('Error updating image in IndexedDB', error);
              this.showPopup('Error updating image in IndexedDB');
            };
          } else {
            this.showPopup('No image found in IndexedDB for updating');
          }
        };
   
        getRequest.onerror = (error) => {
          console.error('Error retrieving image from IndexedDB for updating', error);
          this.showPopup('Error retrieving image from IndexedDB for updating');
        };
      },
      deleteStoredImage() {
        const storeName = 'YourStoreName';
   
        const transaction = this.db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);
   
        const getRequest = objectStore.getAll();
   
        getRequest.onsuccess = () => {
          const images = getRequest.result;
          if (images.length > 0) {
            const itemId = images[0].id;
            const deleteRequest = objectStore.delete(itemId);
   
            deleteRequest.onsuccess = () => {
              console.log('Image deleted from IndexedDB successfully');
              this.showPopup('Image deleted successfully!');
              this.storedImage = null; // Clear displayed image
            };
   
            deleteRequest.onerror = (error) => {
              console.error('Error deleting image from IndexedDB', error);
              this.showPopup('Error deleting image from IndexedDB');
            };
          } else {
            this.showPopup('No image found in IndexedDB for deletion');
          }
        };
   
        getRequest.onerror = (error) => {
          console.error('Error retrieving image from IndexedDB for deletion', error);
          this.showPopup('Error retrieving image from IndexedDB for deletion');
        };
      },
    },
  };
  </script>
  