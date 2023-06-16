import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const app = initializeApp({
  databaseURL: "https://personal-insulin-calculator-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

export const db = getDatabase(app);
