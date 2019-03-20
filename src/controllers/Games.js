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
      buyin: payload.buyin,
      rebuy: payload.rebuy,
      fee: payload.fee,
      players: payload.players,
      active: payload.active,
      createdAt: payload.createdAt,
      updatedAt: timeStamp.getTime()
    });
  } catch (error) {
    throw error;
  }
};

export const addGame = async (payload) => {
  try {
    let timeStamp = new Date();

    // todo - replace after impelement adimn auth
    // const uid = Auth.currentUser.uid;

    await Firestore.collection('games')
      .add({
        buyin: payload.buyin,
        rebuy: payload.rebuy,
        fee: payload.fee,
        name: payload.name,
        active: payload.active || true,
        admin: 'Jk7kU7qrsTUSEAarli73m0FfkVk2', //todo replace uid
        players: payload.players,
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
