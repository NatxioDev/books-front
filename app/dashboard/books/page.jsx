"use client";

import BooksTable from "@/app/ui/books/books-table.jsx";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { useDisclosure } from "@nextui-org/react";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = () => {
    const formData = {
      title,
      author,
      description,
      category,
      stock,
      price,
    };

    // add status to the form data
    formData.status = 1;

    console.log(formData);

    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };
    fetch("http://localhost:4000/books/save", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.statusCode == "200") {
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
        }
      });
  };

  

  const handleSelectionChange = (e) => {
    setCategory(e.target.value);
  };
  return (
    <>
      <div className="flex flex-row justify-between mb-5">
        <h1 className="text-2xl font-bold">Books</h1>
        <Button onPress={onOpen} color="primary">
          Add new Book
        </Button>
      </div>
      <ToastContainer />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add new Book
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Title"
                  value={title}
                  onValueChange={setTitle}
                  placeholder="Enter the title"
                  variant="bordered"
                />
                <Input
                  label="Author"
                  placeholder="Enter the author"
                  value={author}
                  onValueChange={setAuthor}
                  variant="bordered"
                />
                <Textarea
                  label="Description"
                  placeholder="Enter the description"
                  variant="bordered"
                  value={description}
                  onValueChange={setDescription}
                />
                <Select
                  label="Category"
                  placeholder="Select a category"
                  variant="bordered"
                  selectedKeys={[category]}
                  onChange={handleSelectionChange}
                >
                  <SelectItem key={"Classic"} value="Classic">
                    Classic
                  </SelectItem>
                  <SelectItem key={"Fiction"} value="Fiction">
                    Fiction
                  </SelectItem>
                  <SelectItem key={"Education"} value="Education">
                    Education
                  </SelectItem>
                </Select>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
                  <Input
                    label="Stock"
                    placeholder="Enter the stock"
                    type="number"
                    variant="bordered"
                    value={stock}
                    onValueChange={setStock}
                  />
                  <Input
                    label="Price"
                    placeholder="Enter the price"
                    variant="bordered"
                    type="float"
                    value={price}
                    onValueChange={setPrice}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <BooksTable />
    </>
  );
}
