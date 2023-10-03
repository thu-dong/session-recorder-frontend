import React, { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Session() {
  const paperStyle = {
    padding: "50px 20px",
    width: "35ch",
    margin: "20px auto",
  };
  const [vehicleId, setVehicleId] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [operatorLabels, setOperatorLabels] = useState([]);
  const [selectedOperatorLabel, setSelectedOperatorLabel] = useState(null);
  const [open, setOpen] = React.useState(false);

  const submitSession = (e) => {
    e.preventDefault();

    const session = {
      vehicleId,
      startTime,
      endTime,
      totalCost: calculateCost(),
      operator: selectedOperatorLabel,
    };
    fetch("http://localhost:8080/session/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    }).then(() => {
      setOpen(true);
    });
  };

  const handleStartTimeChange = async (newDateTime) => {
    setStartTime(newDateTime);
    await checkLatestEndTime(newDateTime);
  };

  const handleEndTimeChange = (newDateTime) => {
    if (startTime && newDateTime.isBefore(startTime)) {
      alert("End date cannot be before the start date");
    } else {
      setEndTime(newDateTime);
    }
  };

  const calculateCost = () => {
    if (startTime && endTime) {
      const cost = ((endTime - startTime) / (1000 * 60)) * 0.029;
      const roundedCost = Math.max(0.01, Math.round(cost * 100) / 100);
      return roundedCost.toString();
    } else {
      return "";
    }
  };

  const isNumericInput = (event) => {
    const input = event.target.value;
    if (/^\d*$/.test(input)) {
      setVehicleId(input);
    }
  };

  const checkLatestEndTime = async (newDateTime) => {
    try {
      const response = await fetch(
        `http://localhost:8080/session/latestEndTime/${vehicleId}`
      );
      if (response.status === 200) {
        const latestEndTime = await response.json();
        if (!newDateTime.isAfter(latestEndTime)) {
          setStartTime(null);
          const formattedDate = dayjs
            .utc(latestEndTime)
            .tz("Europe/Berlin")
            .format("DD.MM.YYYY / HH:mm");
          alert("Pick a new date that is after " + formattedDate + ".");
        }
      }
    } catch (error) {
        console.error("Error fetching the latest end time:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch("http://localhost:8080/operator/getAll")
      .then((response) => response.json())
      .then((data) => {
        setOperatorLabels(data);

        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setSelectedOperatorLabel(data[randomIndex]);
        }
      });
  }, []);

  return (
    <center>
      <Paper elevation={3} style={paperStyle}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateTimePicker"]}>
            <h3>New Session</h3>

            <Stack direction="row" spacing={1}>
              {operatorLabels.map((operator) => (
                <Chip
                  key={operator.id}
                  label={operator.name}
                  style={
                    operator === selectedOperatorLabel 
                    ? { backgroundColor: "#2bb1c9" }
                    : { fontStyle: "italic" }
                  }
                />
              ))}
            </Stack>

            <TextField
              id="outlined-basic"
              label="Vehicle ID"
              variant="outlined"
              fullWidth
              value={vehicleId}
              onChange={isNumericInput}
            />

            <DateTimePicker
              sx={{
                width: "35ch",
              }}
              label="Start Time"
              value={startTime}
              onChange={handleStartTimeChange}
              format="DD.MM.YYYY HH:mm"
              minutesStep={1}
            />
            <DateTimePicker
              sx={{
                width: "35ch",
              }}
              label="End Time"
              value={endTime}
              onChange={handleEndTimeChange}
              format="DD.MM.YYYY HH:mm"
              minutesStep={1}
              disabled={!startTime}
            />

            <TextField
              type="text"
              value={
                calculateCost() !== ""
                  ? calculateCost() + "€"
                  : "0.029€ per Minute"
              }
              variant="outlined"
              disabled
              fullWidth
              inputProps={{
                readOnly: true,
                style: { textAlign: "right" },
              }}
            />
            <Button
              onClick={submitSession}
              variant="contained"
              disabled={!startTime || !endTime}
              style={{ background: '#2bb1c9' }}
            >
              Submit
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Thank you for your new submission!"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Your new Charging Data Record has been successfully submitted.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} autoFocus>
                  Okay.
                </Button>
              </DialogActions>
            </Dialog>
          </DemoContainer>
        </LocalizationProvider>
      </Paper>
    </center>
  );
}
