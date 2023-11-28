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
import useSWR from "swr";
import { useState, useEffect } from "react";

const statusColorMap = {
  1: "success",
  0: "danger",
  2: "warning",
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const columns = [
  { uid: "id", name: "ID" },
  { uid: "name", name: "Name" },
  { uid: "lastname", name: "Lastname" },
  { uid: "ci", name: "CI" },
  { uid: "status", name: "Status" },
  { uid: "actions", name: "Actions" },
];

export default function UsersTable() {
  const { data, error } = useSWR("http://localhost:5000/customers", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  console.log("data", data.data);

  const customers = data.data;

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
      <TableBody items={customers}>
        {(item) => (
          <TableRow key={item.idCustomer}>
            <TableCell>{item.idCustomer}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.lastname}</TableCell>
            <TableCell>{item.ci}</TableCell>
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

            <TableCell>
              <div className="relative flex items-center gap-2">
                <Tooltip content="Details">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Tooltip>
                <Tooltip content="Edit user">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EditIcon />
                  </span>
                </Tooltip>
                <Tooltip color="danger" content="Delete user">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
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
