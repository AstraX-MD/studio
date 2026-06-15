/**
 * @fileOverview Firestore provider using client SDK as per framework guidelines.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

export default class FirebaseProvider {
  constructor(bot) {
    this.bot = bot;
    this.db = null;
  }

  async init() {
    const config = {
      apiKey: process.env.FIREBASE_API_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    };
    const app = initializeApp(config);
    this.db = getFirestore(app);
  }

  async get(coll, key) {
    const snap = await getDoc(doc(this.db, coll, key));
    return snap.exists() ? snap.data() : null;
  }

  async set(coll, key, value) {
    await setDoc(doc(this.db, coll, key), value, { merge: true });
  }

  async delete(coll, key) {
    await deleteDoc(doc(this.db, coll, key));
  }

  async has(coll, key) {
    const snap = await getDoc(doc(this.db, coll, key));
    return snap.exists();
  }

  async all(coll) {
    const snap = await getDocs(collection(this.db, coll));
    const results = {};
    snap.forEach(d => results[d.id] = d.data());
    return results;
  }
}
