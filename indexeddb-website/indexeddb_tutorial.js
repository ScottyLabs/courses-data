const customerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];
let db;
const request = window.indexedDB.open("MyTestDatabase", 1);

request.onerrror = (event) => {
    console.log("failure");
};

request.onsuccess = (event) => {
    db = event.target.result;
};

db.onerror = (event) => {
    console.error(`Database error: " ${event.target.error?.message}`)
}

request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // ssn must be unique
    const objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

    // Creates an index to search customers by name, may have duplicates
    objectStore.createIndex("name", "name", { unique: false });

    objectStore.createIndex("email", "email", { unique: true });

    // use transaction oncomplete to make sure the objectcreation is 
    // finished before adding data into it
    objectStore.transaction.oncomplete = (event) => {
        const customerObjectStore = db.transaction("customers", "readwrite")
            .objectStore("customers");
        customerData.forEach((customer) => {
            customerObjectStore.add(customer);
        })
    }
}

const transaction = db.transaction(["customers"], "readwrite");
