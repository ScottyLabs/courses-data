
'use strict';

const storeName = 'localFiles';
const storeKey = 'fileName';
const dbVersion = 1;
let db = null;

// IndexedDB Methods
const initIndexedDb = (dbName, stores) => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, dbVersion);
		request.onerror = (event) => {
			reject(event.target.error);
		};
		request.onsuccess = (event) => {
			resolve(event.target.result);
		};
		request.onupgradeneeded = (event) => {
			stores.forEach((store) => {
				const objectStore = event.target.result.createObjectStore(store.name, {
					keyPath: store.keyPath,
				});
				objectStore.createIndex(store.keyPath, store.keyPath, { unique: true });
			});
		};
	});
};

const clearEntriesFromIndexedDb = () => {
	const store = db.transaction(storeName, 'readwrite').objectStore(storeName);

	store.clear();

	store.transaction.oncomplete = () => {
		renderStorageQuotaInfo();
	};
};

const deleteFileFromIndexedDb = (storeKey) => {
	const store = db.transaction(storeName, 'readwrite').objectStore(storeName);
	store.delete(storeKey);
	store.transaction.oncomplete = async () => {
		await renderStorageQuotaInfo();
	};
};

/**
 * @desc Gets the file from the input field and adds it to the IndexedDB
 * @param {Event} ev
 * @returns {Promise<void>}
 */
const handleSubmit = async (ev) => {
	ev.preventDefault();
	try {
		// const file = await getFileFromInput();
		let transaction = db.transaction(storeName, 'readwrite');
		transaction.oncomplete = (event) => {
			console.log("looking at the data!");
		}
		// transaction.onerror = (event) => {
		// 	console.log(event);
		// }
		var store = transaction.objectStore(storeName);
		// var addRequest = store.add(file);
		// addRequest.onsuccess = (event) => {
		// 	console.log("file successfully added!");
		// }

		var readRequest = await store.get("foo.txt");
		console.log(readRequest);

		readRequest.onerror = (event) => {
			console.log(event);
		};
		readRequest.onsuccess = async (event) => {
			// Do something with the request.result!
			var fileBlob = new Blob([readRequest.result.data], { type: "text/plain" });
			console.log(fileBlob);
			var blobText = await fileBlob.text();
			console.log(blobText);
			// const reader = new FileReader();
			// reader.addEventListener("loadend", function () {
			// 	// The result property contains the content of the Blob as a text string
			// 	const textContent = reader.result;
			// 	console.log(textContent);
			// });
		};


	} catch (error) {
		console.log(error);
	}
};

/**
 * @desc Gets the file from the URL and puts it in the indexedDB
 * @returns {Promise<object>}
 */
async function getFileFromInput() {
	const url = document.getElementById('text').value;
	console.log(url);
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("what are you doing");
		}
		const blob = await response.blob();
		console.log(blob);
		const file = new File([blob], "foo.txt", { type: "text/plain" });

		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				document.getElementById('text').value = '';
				resolve({
					[storeKey]: file.name,
					type: file.type,
					size: file.size,
					data: event.target.result,
				});
			};
			reader.onerror = (event) => {
				reject(event.target.error);
			};
			reader.readAsArrayBuffer(file);
		});
	} catch (error) {
		console.error(error);

		return null;
	}

	return null;

};

// Methods for Storage quota
/**
 * @desc Gets the current storage quota
 * @returns {Promise<{totalQuota: string, usedQuota: string, freeQuota: string}>}
 */
const getStorageQuotaText = async () => {
	const estimate = await navigator.storage.estimate();
	const totalQuota = +(estimate.quota || 0);
	const usedQuota = +(estimate.usage || 0);
	const freeQuota = totalQuota - usedQuota;
	return {
		totalQuota: formatAsByteString(totalQuota),
		usedQuota: formatAsByteString(usedQuota),
		freeQuota: formatAsByteString(freeQuota)
	};
};

/**
 * @desc Renders the storage quota info in the DOM
 * @returns {Promise<void>}
 */
const renderStorageQuotaInfo = async () => {
	const { totalQuota, usedQuota, freeQuota } = await getStorageQuotaText();
	document.getElementById('storage-total').textContent = totalQuota;
	document.getElementById('storage-used').textContent = usedQuota;
	document.getElementById('storage-free').textContent = freeQuota;
}

// Util functions
const formatAsByteString = (bytes) => {
	const oneGigabyte = 1024 * 1024 * 1024;
	const oneMegabyte = 1024 * 1024;
	const oneKilobyte = 1024;

	return bytes > oneGigabyte ? `${(bytes / oneGigabyte).toFixed(2)} GB` : bytes > oneMegabyte ? `${(bytes / oneMegabyte).toFixed(2)} MB` : `${(bytes / oneKilobyte).toFixed(2)}KB`;
}


// Init event listeners
document.querySelector('#file-form')?.addEventListener('submit', handleSubmit);
document.querySelector('#search-form')?.addEventListener('submit', handleSearch);
document.querySelector('#clear-button')?.addEventListener('click', clearEntriesFromIndexedDb);

window.addEventListener('load', async () => {
	/** Uncomment the following code to enable user's persistent storage settings */
	// const requestPermission = await navigator.storage.persisted();
	// const persistent = await navigator.storage.persist();
	// if (persistent && requestPermission) {
	db = await initIndexedDb('my-db', [{ name: storeName, keyPath: storeKey }]);
	await renderStorageQuotaInfo();
	// } else {
	// 	console.warn('Persistence is not supported');
	// }
});
