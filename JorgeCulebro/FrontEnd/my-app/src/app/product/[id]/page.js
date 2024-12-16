"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import apiBody from "@/json/apiBody.json";

export default function ProductPage({ params: paramsPromise }) {
  const [params, setParams] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });
  //used to hold the data from responses
  const [quoteData, setQuoteData] = useState(null); 
  const [orderData, setOrderData] = useState(null); 

  const router = useRouter();

  //error handling
  const handleError = (error, message) => {
    console.error(message, error?.response?.data || error?.message || "Unknown error");
  };

  //resolve params to avoid deprecated usage
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await paramsPromise;
        setParams(resolvedParams);
      } catch (error) {
        handleError(error, "Failed to resolve params");
      }
    };
    resolveParams();
  }, [paramsPromise]);

  //load product details
  useEffect(() => {
    if (!params) return;

    const loadProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/read/${params.id}`);
        setProduct(response.data);
      } catch (error) {
        handleError(error, "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params]);

  //update form input dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //request body builder
  const buildRequestBody = (type = "quote") => {
    if (!product) return null;

    const body = JSON.parse(JSON.stringify(apiBody.rateRequest));
    body.destination.name = formData.name;
    body.destination.company = formData.name;
    body.destination.street = formData.address;
    body.destination.city = formData.city;
    body.destination.postalCode = formData.postalCode;
    body.packages[0].content = product.name;
    body.packages[0].dimensions.length = product.length;
    body.packages[0].dimensions.width = product.width;
    body.packages[0].dimensions.height = product.height;

    if (type === "order") {
      body.shipment.service = "express";
    }

    return body;
  };

  //quote handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      handleError(null, "No token found");
      return;
    }

    const requestBody = buildRequestBody("quote");
    if (!requestBody) {
      handleError(null, "Failed to build body");
      return;
    }

    try {
      const response = await axios.post("https://api-test.envia.com/ship/rate/", requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const deliveryInfo = response.data.data[0];
      setQuoteData({
        deliveryEstimate: deliveryInfo.deliveryEstimate,
        deliveryDate: deliveryInfo.deliveryDate.date,
        totalPrice: deliveryInfo.totalPrice,
        carrier: deliveryInfo.carrierDescription,
        importFee: deliveryInfo.importFee,
      });

      setShowForm(false);
    } catch (error) {
      handleError(error, "Error retrieving quote");
    }
  };

  //order handler
  const handleOrderNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleError(null, "No authorization token found");
      return;
    }

    const requestBody = buildRequestBody("order");
    if (!requestBody) {
      handleError(null, "Failed to build request body");
      return;
    }

    try {
      const response = await axios.post("https://api-test.envia.com/ship/generate/", requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const orderInfo = response.data.data[0];
      setOrderData({
        carrier: orderInfo.carrier,
        service: orderInfo.service,
        trackingNumber: orderInfo.trackingNumber,
        trackUrl: orderInfo.trackUrl,
        label: orderInfo.label,
      });

      //used to hide not required components
      setQuoteData(null);
    } catch (error) {
      handleError(error, "Error creating order");
    }
  };

  //loading screen
  if (loading) {
    return  <div className="flex justify-center items-center h-screen min-h-screen bg-gray-100 p-6">
              <div className="relative inline-flex">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
              </div>
            </div>;;
  }

  //main component
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="w-full h-60 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-gray-500 text-lg">No Image Available</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mt-4">{product.name}</h1>
        <p className="text-gray-600 text-sm mt-2">{product.description}</p>
        <p className="text-gray-600 text-sm mt-4">
          <strong>Dimensions:</strong> {product.height}cm x {product.length}cm x {product.width}cm
        </p>

        {!showForm && !quoteData && !orderData && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 w-full bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-indigo-500">
            Get Quote
          </button>
        )}

        {showForm && (
          <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-indigo-500">
                Submit
              </button>
            </div>
          </form>
        )}

        {quoteData && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800">Quote Details</h2>
            <p className="text-gray-600 mt-2">
              <strong>Delivery Estimate:</strong> {quoteData.deliveryEstimate}
            </p>
            <p className="text-gray-600">
              <strong>Delivery Date:</strong> {quoteData.deliveryDate}
            </p>
            <p className="text-gray-600">
              <strong>Total Price:</strong> ${quoteData.totalPrice}
            </p>
            <p className="text-gray-600">
              <strong>Carrier:</strong> {quoteData.carrier}
            </p>
            <p className="text-gray-600">
              <strong>Import Fee:</strong> ${quoteData.importFee}
            </p>
            <button
              onClick={handleOrderNow}
              className="mt-6 w-full bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-green-500">
              Order Now
            </button>
          </div>
        )}

        {orderData && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
            <p className="text-gray-600 mt-2">
              <strong>Carrier:</strong> {orderData.carrier}
            </p>
            <p className="text-gray-600">
              <strong>Service:</strong> {orderData.service}
            </p>
            <p className="text-gray-600">
              <strong>Tracking Number:</strong> {orderData.trackingNumber}
            </p>
            <p className="text-gray-600">
              <strong>Track URL:</strong>{" "}
              <a href={orderData.trackUrl} target="_blank" className="text-blue-600 underline">
                {orderData.trackUrl}
              </a>
            </p>
            <p className="text-gray-600">
              <strong>Label:</strong>{" "}
              <a href={orderData.label} target="_blank" className="text-blue-600 underline">
                Download Label
              </a>
            </p>
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="mt-6 w-full bg-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded hover:bg-gray-300">
          Go Back
        </button>
      </div>
    </div>
  );
}
