//import of user model
import User from '../Models/user.js';
//import firebase data and initialization
import firebase from '../firebase.js';
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc
} from 'firebase/firestore';
const db = getFirestore(firebase);

//read user by attribute
  export const getUser = async (req, res) => {
    try {
      const userName = req.params.userName;
      const password = req.params.password;
      const userInfo = new User();
      let tokenID;
      const users = await collection(db, 'users');
      const q = query(users, where("username", "==", userName), where("password", "==", password));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        userInfo.id = doc.id;
        userInfo.dataID = doc.data().dataID;
        tokenID = doc.data().tokenID;
      });
      const getUserData = doc(db, 'users_data', userInfo.dataID);
      const info = await getDoc(getUserData)
      const getToken = doc(db, 'access_tokens', tokenID);
      const token = await getDoc(getToken);
      userInfo.token = token.data().token;
      userInfo.name = info.data().name;
      userInfo.phone = info.data().phone;
      userInfo.profileImage = info.data().img_profile;
      if (token.exists()) {
        res.status(200).send(userInfo);
      } else {
        res.status(404).send(`User not found`);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };