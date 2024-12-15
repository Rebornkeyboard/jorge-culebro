"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProductPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const router = useRouter();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        //get products from server
        const response = await axios.get(`http://localhost:3000/api/products/read/${id}`);
        //load products
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  //show shipping form
  const handleCheckout = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    //get login saved token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authorization token found. Log in again!");
      return;
    }
  
    try {
      const response = await axios.post(
        "https://api-test.envia.com/ship/rate/",
        {
          origin: {
            name: "Mexico",
            company: "Envia",
            email: "mexico@envia.com",
            phone: "8180162137",
            street: "vasconcelos",
            number: "1400",
            district: "jardines de mirasierra",
            city: "san pedro garza garcia",
            state: "nl",
            country: "MX",
            postalCode: "66236",
            reference: "",
            coordinates: {
              latitude: "25.655552",
              longitude: "-100.397811",
            },
          },
          destination: {
            name: formData.name,
            company: "Envia",
            email: "mexico@envia.com",
            phone: "8180100135",
            street: formData.address,
            number: "2470 of 310",
            district: "obispado",
            city: formData.city,
            state: "nl",
            country: "MX",
            postalCode: formData.postalCode,
            reference: "",
            coordinates: {
              latitude: "25.672530",
              longitude: "-100.348120",
            },
          },
          packages: [
            {
              content: product.name,
              amount: 1,
              type: "box",
              weight: 1,
              insurance: 0,
              declaredValue: 0,
              weightUnit: "KG",
              lengthUnit: "CM",
              dimensions: {
                length: product.length,
                width: product.width,
                height: product.height,
              },
            },
          ],
          shipment: {
            carrier: "estafeta",
            type: 1,
          },
          settings: {
            printFormat: "PDF",
            printSize: "STOCK_4X6",
            currency: "MXN",
            cashOnDelivery: "500.00",
            comments: "",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Response:", response.data);
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.status} - ${error.response.data.message}`);
      } else {
        console.log(error.response);
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-600">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="w-full h-60 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-gray-500 text-lg">No Image Available</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mt-4">{product.name}</h1>
        <p className="text-gray-600 text-sm mt-2">{product.description}</p>
        <p className="text-gray-600 text-sm mt-4">
          <strong>Dimensions:</strong> {product.height}m x {product.length}m x {product.width}m
        </p>

        {!showForm && (
          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-indigo-500"
          >
            Buy Now
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-indigo-500"
              >
                Confirm Purchase
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <button
          onClick={() => router.back()}
          className="mt-6 w-full bg-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}