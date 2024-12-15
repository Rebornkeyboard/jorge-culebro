//import of user model
import User from '../Models/user.js';
//import firebase data and initialization
import firebase from '../firebase.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
const db = getFirestore(firebase);

//create function
export const createUser = async (req, res) => {
    try {
        const data = req.body;
        await addDoc(collection(db, 'users'), data);
        res.status(200).send('User created');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
  };

//read all users function
export const getUsers = async (req, res) => {
    try {
      const users = await getDocs(collection(db, 'users'));
      const userArray = [];
  
      if (users.empty) {
        res.status(400).send('No users found');
      } else {
        users.forEach((doc) => {
          const user = new User(
            doc.id,
            doc.data().name,
            doc.data().phone,
            doc.data().profileImage
          );
          userArray.push(user);
        });
  
        res.status(200).send(userArray);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

//read user by id
  export const getUser = async (req, res) => {
    try {
      const id = req.params.id;
      const user = doc(db, 'users', id);
      const data = await getDoc(user);
      if (data.exists()) {
        res.status(200).send(data.data());
      } else {
        res.status(404).send(`User [${id}] not found`);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

//update user
export const updateUser = async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const user = doc(db, 'users', id);
      await updateDoc(user, data);
      res.status(200).send('User updated');
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  //deletes user
  export const deleteUser = async (req, res) => {
    try {
      const id = req.params.id;
      await deleteDoc(doc(db, 'users', id));
      res.status(200).send('User deleted');
    } catch (error) {
      res.status(400).send(error.message);
    }
  };