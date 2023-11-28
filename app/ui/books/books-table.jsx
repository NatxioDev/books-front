"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
  Tab,
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import { Button } from "../button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColorMap = {
  1: "success",
  0: "danger",
  2: "warning",
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const columns = [
  { uid: "id", name: "ID" },
  { uid: "title", name: "Title" },
  { uid: "author", name: "Author" },
  { uid: "category", name: "Category" },
  { uid: "status", name: "Status" },
  { uid: "stock", name: "Stock" },
  { uid: "price", name: "Price" },
  { uid: "actions", name: "Actions" },
];

export default function BooksTable() {
  const { data, error, mutate } = useSWR("http://localhost:4000/books", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  console.log("data", data.data);

  const books = data.data;

  const deleteBook = (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`http://localhost:4000/books/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.statusCode == 200) {
          toast.success("Book deleted successfully!");
          mutate()
        } else {
          toast.error("Error deleting book!");
        }
      });
  };

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={books}>
        {(item) => (
          <TableRow key={item.idBook}>
            <TableCell>{item.idBook}</TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.author}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
              <Chip
                className="capitalize"
                color={statusColorMap[item.status]}
                size="sm"
                variant="flat"
              >
                {item.status}
              </Chip>
            </TableCell>
            <TableCell>{item.stock}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>
              <div className="relative flex items-center gap-2">
                <Tooltip content="Edit book">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EditIcon />
                  </span>
                </Tooltip>
                <Tooltip color="danger" content="Delete book">
                  <span
                    className="text-lg text-danger cursor-pointer active:opacity-50"
                    onClick={() => deleteBook(item.idBook)}
                  >
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
