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

export const deactivateUser = async (userId) => {
  try {
    let userCollection = Firestore.collection('users');
    await userCollection.doc(userId).update({
      active: false
    });
  } catch (error) {
    throw error;
  }
};

export const activateUser = async (userId) => {
  try {
    let userCollection = Firestore.collection('users');
    await userCollection.doc(userId).update({
      active: true
    });
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (payload) => {
  try {
    let timeStamp = new Date();
    let userDoc = Firestore.collection('users').doc(payload.id);
    await userDoc.update({
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      active: payload.active,
      createdAt: payload.createdAt || timeStamp.getTime()
    });
  } catch (error) {
    throw error;
  }
};

export const addUser = async (payload) => {
  try {
    let timeStamp = new Date();
    await Firestore.collection('users')
      .add({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        active: payload.active || true,
        createdAt: timeStamp.getTime()
      })
      .then((docRef) => {
        Firestore.collection('users')
          .doc(docRef.id)
          .set(
            {
              id: docRef.id
            },
            { merge: true }
          );
      })
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });
  } catch (error) {
    throw error;
  }
};
