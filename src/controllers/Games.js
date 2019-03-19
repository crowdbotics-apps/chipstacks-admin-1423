import { Firestore } from '../lib/firebase';

// search games with the criteria
export const getGames = async () => {
  let gameCollection = Firestore.collection('games');

  try {
    let snapshot = await gameCollection.get();
    let tasks = snapshot.docs.map((gameDoc) => getGameById(gameDoc.id));
    let games = Promise.all(tasks);
    return games;
  } catch (error) {
    throw error;
  }
};

export const getGameById = async (gameId) => {
  let gameCollection = Firestore.collection('games');

  try {
    let snapshot = await gameCollection.doc(gameId).get();
    let game = await snapshot.data();
    return game;
  } catch (error) {
    throw error;
  }
};

export const deactivateGame = async (gameId) => {
  try {
    let gameCollection = Firestore.collection('games');
    await gameCollection.doc(gameId).update({
      active: false
    });
  } catch (error) {
    throw error;
  }
};

export const activateGame = async (gameId) => {
  try {
    let gameCollection = Firestore.collection('games');
    await gameCollection.doc(gameId).update({
      active: true
    });
  } catch (error) {
    throw error;
  }
};

export const updateGame = async (payload) => {
  try {
    let timeStamp = new Date();
    let gameDoc = Firestore.collection('games').doc(payload.id);
    await gameDoc.update({
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

export const addGame = async (payload) => {
  try {
    let timeStamp = new Date();
    await Firestore.collection('games')
      .add({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        active: payload.active || true,
        createdAt: timeStamp.getTime()
      })
      .then((docRef) => {
        Firestore.collection('games')
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
