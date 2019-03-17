import { Firestore } from '../lib/firebase';

// search users with the criteria
export const getUsers = async () => {
  let userCollection = Firestore.collection('users');

  try {
    let snapshot = await userCollection.get();
    let tasks = snapshot.docs.map((userDoc) => getUserById(userDoc.id));
    let users = Promise.all(tasks);
    return users;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId) => {
  let userCollection = Firestore.collection('users');

  try {
    let snapshot = await userCollection.doc(userId).get();
    let user = await snapshot.data();
    return user;
  } catch (error) {
    throw error;
  }
};
