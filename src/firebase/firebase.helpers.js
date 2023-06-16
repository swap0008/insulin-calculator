import { ref, onValue, set, update, remove, push } from "firebase/database";
import { db } from './firebase';

export const readData = (path, callback, isFetchDataById) => {
  const query = ref(db, path);
  onValue(query, (snapshot) => {
    if (isFetchDataById) {
      const data = snapshot.val();
      callback(data);
    } else {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        data.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      callback(data);
    }
  });
}

export const createData = (path, data, useSet) => {
  const query = ref(db, path);
  if (useSet) set(query, data);
  else push(query, data);
}

export const updateData = (path, data) => {
  const query = ref(db, path);
  update(query, data);
}

export const deleteData = (path) => {
  const query = ref(db, path);
  remove(query);
}