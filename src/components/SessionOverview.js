import React, { useState, useEffect } from "react";
import  Paper  from "@mui/material/Paper";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function SessionOvervie() {
  const paperStyle = {
    padding: "50px 20px",
    width: "90%",
    margin: "20px auto",
  };
  const [rowData, setRowData] = useState([]);

  const columns = [
    { field: "sessionId", headerName: "Session ID", width: 90 },
    { field: "vehicleId", headerName: "Vehicle ID", width: 100 },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 170,
      valueFormatter: (params) => {
        return dayjs
          .utc(params.value)
          .tz("Europe/Berlin")
          .format("DD.MM.YYYY / HH:mm");
      },
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 170,
      valueFormatter: (params) => {
        return dayjs
          .utc(params.value)
          .tz("Europe/Berlin")
          .format("DD.MM.YYYY / HH:mm");
      },
    },
    {
      field: "totalCost",
      headerName: "Cost",
      width: 100,
      renderCell: (params) => {
        return `${params.value.toFixed(2)} €`;
      },
    },
  ];

  useEffect(() => {
    fetch("http://localhost:8080/session/getAll")
      .then((res) => res.json())
      .then((result) => {
        setRowData(result);
      });
  }, []);

  return (
    <Paper elevation={3} style={paperStyle}>
      <h3 style={{textAlign: 'left', paddingLeft: '20px'}}>Overview Sessions</h3>
      <DataGrid
        disableColumnSelector
        disableDensitySelector
        slotProps={{
          toolbar: {
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
            quickFilterProps: { debounceMs: 250 },
          },
        }}
        columns={columns}
        rows={rowData}
        getRowId={(row) => row.sessionId}
        id="id"
        pageSize={15}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Paper>
  );
}
