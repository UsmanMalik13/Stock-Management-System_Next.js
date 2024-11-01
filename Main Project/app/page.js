"use client";

import React, { useState, useEffect } from "react";
import { Header } from "./Components/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [productForm, setProductForm] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  const [products, setProducts] = useState([]);

  const [alert, setAlert] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  let query;

  const [loading, setLoading] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState("name");

  const [searchResults, setSearchResults] = useState([]);

  const [loadingAction, setLoadingAction] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [productToDeleteId, setProductToDeleteId] = useState("");

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleSearchQueryChange = (e) => {
    query = e.target.value;

    if (query === "")
    {
      setSearchResults([]);
      setSearchQuery("");
      return; // Prevent searching if the query is empty
    } else {
      setSearchQuery(query);
    }
  };

  const handleSearchCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      if (!productForm.name || !productForm.quantity || !productForm.price) {
        console.error("Please fill out all fields");
        return;
      } else {
        const response = await fetch("/api/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productForm),
        });
        const result = await response.json();
        //console.log(result.message);

        // Reset form fields
        setProductForm({ id: "", name: "", quantity: "", price: "" });

        //Calling the fetchProducts function again to update the table.
        fetchProducts();

        //Setting a timeout of 1 second in which the showSuccess will be true, which will display the span. After 1 second, it will become false again.
        setAlert("Your product has been successfully added.");
        setTimeout(() => {
          setAlert("");
        }, 1000);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const searchProducts = async () => {
    if (searchQuery === "")
    {
      setSearchResults([]);
      return; // Prevent searching if the query is empty
    }
    
    try {
      if(!loading)
      {
        setLoading(true);
        const response = await fetch(`/api/search?searchText=${searchQuery}&searchCriteria=${searchCriteria}`);
        const data = await response.json();
        
        setSearchResults(data.products);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  }

  const buttonAction = async (action, itemName) => {  
    try {
      setLoadingAction(true);
      const response = await fetch(`/api/updateProduct/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, itemName }),
      });
      const result = await response.json();
      //console.log(result.message);

      if (response.ok) {
        // Calling the fetchProducts function again to update the table.
        fetchProducts();

        // Calling the searchProducts function again to update the search results.
        searchProducts();
      } else {
        console.error('Error:', result.error);
      }

      setLoadingAction(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  const handleDelete = (id) => {
    setModalVisible(true);
    setProductToDeleteId(id);
  }

  const deleteProduct = async () => {
    try {
      const response = await fetch("/api/deleteProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productToDeleteId }),
      });

      if (response.ok) {
        setAlert("Product deleted successfully.");
        fetchProducts();
        setModalVisible(false);
        setTimeout(() => {
          setAlert("");
        }, 1000);
      } else {
        const error = await response.json();
        console.error('Error deleting product:', error);
        setAlert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setAlert("Error deleting product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    searchProducts();
  }, [searchQuery, searchCriteria]);

  return (
    <>
      <Header />

      <div className="container mx-auto p-4">
        {/* We will show the following span when the product is added for 1 second. */}
        <div className="text-center">
          <span className="bg-green-100 text-center">{alert}</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">
          Search Products
        </h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex items-center">
            <div className="mb-4 w-4/5">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="searchQuery"
              >
                Search
              </label>
              <input
                type="text"
                name="searchQuery"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter search term"
                value={searchQuery}
                //onBlur={() => {setSearchResults([]);}}
                onChange={handleSearchQueryChange}
              />
            </div>
            <div className="mb-4 w-1/5">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="searchCriteria"
              >
                Search By
              </label>
              <select
                name="searchCriteria"
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={searchCriteria}
                onChange={handleSearchCriteriaChange}
              >
                <option value="name">Product Name</option>
                <option value="quantity">Quantity</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
          <div className="dropcontainer w-4/5 border border-1 bg-white rounded-md">
            {
              loading ? (
                <div className="text-center flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="100, 80" strokeLinecap="round">
                      <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 25 25;360 25 25" keyTimes="0;1"/>
                    </circle>
                  </svg>
                </div>
              ) : (
                <div>
                  {
                    searchResults.length === 0 ? (
                      <></>
                    ) : (
                      <div className="container flex justify-between bg-gray-200 p-2">
                        <span className="font-bold">Product</span>
                        <span className="font-bold">Quantity</span>
                      </div>
                    )
                  }
                  {searchResults.map((item) => (
                    <div key={item.name} className="container flex justify-between bg-purple-100 p-2 border border-b">
                      <span>{item.name}, x{item.quantity} available for {item.price * item.quantity}</span>
                      <div className="flex justify-between">
                        <button onClick={() => {buttonAction("add", item.name)}} disabled={loadingAction} className="add inline-block px-3 py-1 mx-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-300">+</button>
                        <span className="inline-block w-8 text-center">{item.quantity}</span>
                        <button onClick={() => {buttonAction("subtract", item.name)}} disabled={loadingAction} className="subtract inline-block px-3 py-1 mx-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-300">-</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 my-8">
          Add a Product
        </h1>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={addProduct}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="name"
            >
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={productForm.name}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Product Name"
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="quantity"
            >
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={productForm.quantity}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Quantity"
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="number"
              name="price"
              value={productForm.price}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Price"
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Product
            </button>
          </div>
        </form>

        <h1 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">
          Display Current Stock
        </h1>

        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">Product Name</th>
              <th className="py-2 px-4 border-b text-center">Quantity</th>
              <th className="py-2 px-4 border-b text-center">Price</th>
              <th className="py-2 px-4 border-b text-center">Delete Product</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="py-2 px-4 border-b text-center">
                  {product.name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {product.quantity}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  ${product.price}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button onClick={() => {handleDelete(product._id)}} className="add inline-block px-3 py-1 mx-1 bg-red-500 text-white font-semibold rounded-lg shadow-md disabled:bg-red-300"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded shadow-lg p-8 w-80 text-center relative z-50">
            <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-center">
              <button className="bg-red-400 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mr-4" onClick={() => deleteProduct()}>Yes</button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded" onClick={() => setModalVisible(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
