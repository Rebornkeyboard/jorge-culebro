"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //get all products from server
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/productsAll/");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const onClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  //loading waiting for response
  if (loading) {
    return  <div className="flex justify-center items-center h-screen min-h-screen bg-gray-100 p-6">
              <div className="relative inline-flex">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
              </div>
            </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Product catalog</h1>
          <p className="text-gray-600">Browse and manage your products</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer"
              onClick={() => onClick(product.id)}
            >

              <div className="h-40 w-full bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>

              <div className="mt-4 flex-1">
                <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 text-sm mt-2">
                  Dimensions: {product.height}cm x {product.length}cm x {product.width}cm
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}