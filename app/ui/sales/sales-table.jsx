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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColorMap = {
  1: "success",
  0: "danger",
  2: "warning",
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const columns = [
  { uid: "idSale", name: "ID" },
  { uid: "name", name: "Customer Name" },
  { uid: "total", name: "Total" },
  { uid: "actions", name: "Actions" },
];

export default function UsersTable() {
  const { data, error, mutate } = useSWR(
    "http://localhost:2500/sales",
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  console.log("data", data.data);

  const sales = data.data;

  const deleteSale = (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`http://localhost:2500/sales/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        if (data.statusCode == 200) {
          toast.success("Sale deleted successfully");
          mutate();
        }
      });
  };

  return (
    <Table aria-label="Sales Table">
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
      <TableBody items={sales}>
        {(item) => (
          <TableRow key={item.idSale}>
            <TableCell>{item.idSale}</TableCell>
            <TableCell>
              {item.name} {item.lastname}
            </TableCell>
            <TableCell>{item.total} Bs</TableCell>

            <TableCell>
              <div className="relative flex items-center gap-2">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>

                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => deleteSale(item.idSale)}
                >
                  <DeleteIcon />
                  <ToastContainer />
                </span>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
