import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    Container,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Button,
    Stack,
} from "@mui/material";

import {
    getAvailableDates,
    getAvailableGroups,
    getSlotsForGroup,
} from "./slotLogic.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Book() {
    const [params] = useSearchParams();
    const phone = params.get("phone");

    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);

    const [doctorId, setDoctorId] = useState("");
    const [date, setDate] = useState("");
    const [group, setGroup] = useState("");
    const [slotId, setSlotId] = useState("");

    const [appointment, setAppointment] = useState(null);
    const [error, setError] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const isReschedule = appointment?.status === "paid";

    /* ---------------- HARD GUARD ---------------- */
    if (!phone) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Typography color="error" align="center">
                    Invalid booking link. Please open this link from WhatsApp.
                </Typography>
            </Container>
        );
    }

    /* ---------------- CHECK PAID APPOINTMENT ---------------- */
    useEffect(() => {
        fetch(`${API_BASE}/api/booking/appointment?phone=${phone}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data?.status === "paid") {
                    setAppointment(data);
                }
            })
            .catch(() => { });
    }, [phone]);

    /* ================= MY APPOINTMENT (PAID) ================= */
    if (isReschedule && !confirmed && !doctorId) {
        return (
            <Container maxWidth="sm" sx={{ mt: 6 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={3} alignItems="center">
                            <Typography variant="h5" fontWeight={600}>
                                My Appointment
                            </Typography>

                            <Box
                                sx={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 2,
                                    p: 2,
                                    width: "100%",
                                    bgcolor: "#fafafa",
                                }}
                            >
                                <Typography><b>Doctor:</b> {appointment.doctor?.name}</Typography>
                                <Typography><b>Date:</b> {new Date(appointment.slot?.slot).toLocaleDateString("en-IN")}</Typography>
                                <Typography>
                                    <b>Time:</b>{" "}
                                    {new Date(appointment.slot?.slot).toLocaleTimeString("en-IN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </Typography>
                                <Typography color="success.main"><b>Status:</b> Paid</Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="warning"
                                sx={{ minWidth: 240 }}
                                onClick={() => setDoctorId(appointment.doctor?.id)}
                            >
                                Change Slot
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    /* ---------------- LOAD DOCTORS ---------------- */
    useEffect(() => {
        fetch(`${API_BASE}/api/booking/doctors`)
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setDoctors(data);
                else if (Array.isArray(data.data)) setDoctors(data.data);
                else setError("Invalid doctor list");
            })
            .catch(() => setError("Failed to load doctors"));
    }, []);

    /* ---------------- LOAD SLOTS ---------------- */
    useEffect(() => {
        if (!doctorId) return;

        setDate("");
        setGroup("");
        setSlotId("");
        setConfirmed(false);
        setSlots([]);

        fetch(`${API_BASE}/api/booking/slots/all?doctorId=${doctorId}&phone=${phone}`)
            .then((r) => r.json())
            .then(setSlots)
            .catch(() => setError("Failed to load slots"));
    }, [doctorId, phone]);

    /* ---------------- DERIVED ---------------- */
    const dates = useMemo(() => getAvailableDates(slots), [slots]);
    const groups = useMemo(() => (date ? getAvailableGroups(slots, date) : []), [slots, date]);
    const filteredSlots = useMemo(
        () => (group ? getSlotsForGroup(slots, date, group) : []),
        [slots, date, group]
    );

    /* ---------------- CONFIRM ---------------- */
    async function confirmBooking() {
        if (confirming) return;
        setConfirming(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE}/api/booking/confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, slotId }),
            });

            if (!res.ok) throw new Error();
            setConfirmed(true);
        } catch {
            setError("Slot already booked or session expired.");
        } finally {
            setConfirming(false);
        }
    }

    /* ---------------- ERROR ---------------- */
    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Typography color="error" align="center">
                    {error}
                </Typography>
            </Container>
        );
    }

    /* ================= CONFIRMED ================= */
    if (confirmed) {
        return (
            <Container maxWidth="sm" sx={{ mt: 6 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={3} alignItems="center">
                            <Typography variant="h5" color="success.main">
                                {isReschedule ? "Slot Rescheduled" : "Slot Locked"}
                            </Typography>

                            {!isReschedule && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{ minWidth: 220 }}
                                    onClick={() =>
                                    (window.location.href =
                                        "https://payments.cashfree.com/forms/arify3")
                                    }
                                >
                                    Book
                                </Button>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    /* ================= BOOKING FLOW ================= */
    return (
        <Container maxWidth="sm" sx={{ mt: 6, pb: 6 }}>
            <Card>
                <CardContent>
                    <Stack spacing={3}>
                        <Typography variant="h5" align="center" fontWeight={700}>
                            {isReschedule ? "Reschedule Appointment" : "Book Appointment"}
                        </Typography>

                        <FormControl fullWidth>
                            <InputLabel>Doctor</InputLabel>
                            <Select value={doctorId} label="Doctor" onChange={(e) => setDoctorId(e.target.value)}>
                                {doctors.map((d) => (
                                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {slotId && (
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                onClick={confirmBooking}
                                disabled={confirming}
                                sx={{ alignSelf: "center" }}
                            >
                                {confirming ? "Confirming…" : "Confirm Slot"}
                            </Button>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}
