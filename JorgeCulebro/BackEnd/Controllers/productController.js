//import of product model
import Product from '../Models/product.js';
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
export const createProduct = async (req, res, next) => {
    try {
        const data = req.body;
        await addDoc(collection(db, 'catalog_products'), data);
        res.status(200).send('Product created');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
  };

//read all products function
export const getProducts = async (req, res, next) => {
    try {
      const products = await getDocs(collection(db, 'catalog_products'));
      const productArray = [];
  
      if (products.empty) {
        res.status(400).send('No products found');
      } else {
        products.forEach((doc) => {
          const product = new Product(
            doc.id,
            doc.data().name,
            doc.data().description,
            doc.data().height,
            doc.data().length,
            doc.data().width
          );
          productArray.push(product);
        });
  
        res.status(200).send(productArray);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

//read a product by id
  export const getProduct = async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = doc(db, 'catalog_products', id);
      const data = await getDoc(product);
      console.log(req.params);
      
      if (data.exists()) {
        res.status(200).send(data.data());
      } else {
        res.status(404).send(`Product [${id}] not found`);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

//update a product
export const updateProduct = async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const product = doc(db, 'catalog_products', id);
      await updateDoc(product, data);
      res.status(200).send('Product updated');
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  //deletes a product
  export const deleteProduct = async (req, res, next) => {
    try {
      const id = req.params.id;
      await deleteDoc(doc(db, 'catalog_products', id));
      res.status(200).send('Product deleted');
    } catch (error) {
      res.status(400).send(error.message);
    }
  };