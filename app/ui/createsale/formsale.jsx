"use client";

import React from "react";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
} from "@nextui-org/react";
import useSWR from "swr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowRightIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

const statusColorMap = {
  1: "success",
  0: "danger",
  2: "warning",
};

const columnsBook = [
  { uid: "actions", name: "Actions" },
  { uid: "id", name: "ID" },
  { uid: "title", name: "Title" },
  { uid: "quantity", name: "Quantity" },
  { uid: "price", name: "Price" },
  { uid: "total", name: "Total" },
];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function FormSale() {
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);

  const onSelectionBookChange = (id) => {
    setSelectedBook(id);
    console.log("id", selectedBook);
  };

  const onSelectionCustomerChange = (id) => {
    setSelectedCustomer(id);
    console.log("id", selectedCustomer);
  };

  const customersApiUrl = "http://localhost:5000/customers";
  const booksApiUrl = "http://localhost:4000/books"; // Ajusta la URL de la API de libros según tu configuración
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data: customersData, error: customersError } = useSWR(
    customersApiUrl,
    fetcher
  );
  const { data: booksData, error: booksError } = useSWR(booksApiUrl, fetcher);

  if (customersError || booksError) return <div>Failed to load</div>;
  if (!customersData || !booksData) return <div>Loading...</div>;

  const customers = customersData.data;
  const books = booksData.data;

  const customersDeactivated = customers
    .filter((customer) => customer.status === 0)
    .map((customer) => customer.idCustomer);

  const addBookToCart = () => {
    console.log("id", selectedBook);
    const book = books.find((book) => book.idBook == selectedBook);

    const bookInCart = cart.find((book) => book.idBook == selectedBook);
    if (bookInCart) {
      const newCart = cart.map((book) => {
        if (book.idBook == selectedBook) {
          const newQuantity = book.quantity + 1;
          const newTotal = book.price * newQuantity;

          setTotal((prevTotal) => prevTotal - book.total + newTotal); // Actualiza el total

          return {
            ...book,
            quantity: newQuantity,
            total: newTotal,
          };
        } else {
          return book;
        }
      });

      setCart(newCart);
    } else {
      const newQuantity = 1;
      const newTotal = book.price * newQuantity;

      setTotal((prevTotal) => prevTotal + newTotal); // Actualiza el total

      const newBook = {
        idBook: book.idBook,
        title: book.title,
        quantity: newQuantity,
        price: book.price,
        total: newTotal,
      };

      setCart([...cart, newBook]);
    }
  };

  const createSale = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCustomer: selectedCustomer,
        total: total,
      }),
    };
    fetch(`http://localhost:2500/sales/save`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.statusCode == 200) {
          toast.success("Sale created successfully!");

          addBookToSale(data.data.idSale, cart);
        } else {
          toast.error("Error creating sale!");
        }
      });
  };

  const addBookToSale = (idSale, cart) => {
    cart.forEach((book) => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idSale: idSale,
          idBook: book.idBook,
          cant: book.quantity,
        }),
      };
      fetch(`http://localhost:2500/detail/save`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.statusCode == 200) {
            toast.success("Book added succesfully", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else {
            toast.error("Error adding book to sale!");
          }
        });
    });
  };

  return (
    <div>
      <ToastContainer />
      <div>
        <h1 className="text-center text-4xl mb-4">Create Sale</h1>
      </div>
      <div className="flex flex-row gap-2 mt-3 justify-between">
        <Autocomplete
          placeholder="Select a CI"
          className="max-w-xs"
          label="Customer data"
          disabledKeys={customersDeactivated}
          allowsCustomValue={true}
          onSelectionChange={onSelectionCustomerChange}
        >
          {customers.map((customer) => (
            <AutocompleteItem key={customer.idCustomer} textValue={customer.ci}>
              <div className="flex gap-2 items-center">
                <div className="flex flex-col">
                  <span className="text-small">{customer.lastname}</span>
                  <span className="text-tiny text-default-400">
                    {customer.ci}
                  </span>
                </div>
              </div>
            </AutocompleteItem>
          ))}
        </Autocomplete>

        <Autocomplete
          placeholder="Select a Book"
          className="max-w-xs"
          label="Assigned to"
          disabledKeys={customersDeactivated}
          allowsCustomValue={true}
          onSelectionChange={onSelectionBookChange}
        >
          {books.map((book) => (
            <AutocompleteItem key={book.idBook} textValue={book.title}>
              <div className="flex gap-2 items-center">
                <div className="flex flex-col">
                  <span className="text-small">{book.title}</span>
                  <span className="text-tiny text-default-400">
                    {book.author}
                  </span>
                </div>
              </div>
            </AutocompleteItem>
          ))}
        </Autocomplete>

        <Button
          color="primary"
          endContent={<ShoppingCartIcon />}
          onClick={addBookToCart}
        >
          Add to Cart
        </Button>
      </div>

      <Table aria-label="cart" className="mt-4">
        <TableHeader columns={columnsBook}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>

        {cart.length > 0 ? (
          <TableBody items={cart}>
            {(item) => (
              <TableRow key={item.idBook}>
                <TableCell>{item.idBook}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>{item.total}</TableCell>
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody emptyContent="No rows to display.">{[]}</TableBody>
        )}
      </Table>

      <div className="flex flex-row-reverse mt-2 mr-7 pr-7">
        <h1>Total: {total} Bs</h1>
      </div>
      {/* Create a button in the top bottom */}
      <div className="flex flex-row-reverse flex-col-reverse align-bottom mt-52">
        <Button
          color="success"
          className="text-white"
          onClick={createSale}
          endContent={<ArrowRightIcon />}
        >
          Create Sale
        </Button>
      </div>
          
    </div>
  );
}
