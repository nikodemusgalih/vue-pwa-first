<template>
    <div>
        <input type="file" @change="uploadBlob" />
    </div>
    <button @click="readBlob">Read Data</button>
    <div id="showimage">
    </div>
</template>


<script setup>
    import { ref, onMounted } from 'vue';
    const dbName = "the_blob"; 
    var file_blob;
    
    const uploadBlob = (event) =>{
        const file = event.target.files[0];
        
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            file_blob = e.target.value
        }
        fileReader.readAsArrayBuffer(file);

        const blob = new Blob([file_blob], { type: file.type });

        const blobItem = { image: blob };
        const database = indexedDB.open(dbName, 1);

        database.onerror = (event) => {
            console.error("Error opening database:", event.target.error);
        }

        database.onupgradeneeded = (event) => {
            const db = event.target.result;
        
            const objectStore = db.createObjectStore("datablobs", { keyPath: "ssn" });
            objectStore.createIndex("name", "name", { unique: false });
            objectStore.createIndex("email", "email", { unique: true });
            objectStore.createIndex("blob", "blob", { unique: false });
            objectStore.createIndex("file", "file", { unique: false });
            objectStore.createIndex("blob_file", "blob_file", { unique: false });

        };

        database.onsuccess = (event) => {
            const db = event.target.result;

            console.log(file);
            const transaction = db.transaction("datablobs", "readwrite");
            const put =  transaction.objectStore("datablobs");
            var imgUrl = URL.createObjectURL(file);

            const putfile = { ssn:1, name:'name Blob', email:'email', blob:imgUrl, 
                file: file, blob_file: blobItem }
            const addRequest = put.add(putfile);
  
            
            addRequest.onsuccess = (event) => {
                console.log("Data added successfully");
            };
        
            addRequest.onerror = (event) => {
                console.error("Error adding data", event.target.error);
            };

            transaction.oncomplete = () => {
                console.log("Add transaction completed");
                db.close();
            }
        }
    }

    const readBlob = () => {
        const request = indexedDB.open(dbName, 1);
    
        request.onerror = (event) => {
        console.error("Error opening database:", event.target.error);
        };
    
        request.onsuccess = (event) => {
        const db = event.target.result;
    
        const readTransaction = db.transaction("datablobs", "readonly");
        const blobsObjectStore = readTransaction.objectStore("datablobs");
    
        const blobsCursor = blobsObjectStore.openCursor();
    
        blobsCursor.onsuccess = (event) => {
            const cursor = event.target.result;
    
            if (cursor) {
                console.log('cursor :', cursor)
                // const blob = new Blob([atob(cursor.blob_file)], {type:})
                const blob = cursor.value.blob_file.image;
                const imageUrl = URL.createObjectURL(blob);
                const storedImage = imageUrl;

                var divImage = document.getElementById('showimage');
                var eImg = document.createElement("img");
                // var url = cursor.value.blob.substring(5);
                // console.log(url)


                // eImg.setAttribute('src',url )
                eImg.setAttribute('src',storedImage )

                console.log(cursor);
                divImage.appendChild(eImg)
            // // customers.value.push(cursor.value);
            // console.log('customers.value:', customers.value)
            // customers.value.splice(cursor.value.index, 1, cursor.value);
            cursor.continue();
            } else {
            console.log("Data read successfully");
            // customers.value.splice(0, customers.value.length);
            db.close();
            }
        };
    
        blobsCursor.onerror = (event) => {
            console.error("Error reading blob", event.target.error);
            db.close();
        };
        };
    };
</script>

<style>
</style>