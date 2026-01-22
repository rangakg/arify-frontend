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

    const [error, setError] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

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
    const groups = useMemo(
        () => (date ? getAvailableGroups(slots, date) : []),
        [slots, date]
    );
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

    /* ================= CONFIRMED SCREEN ================= */
    if (confirmed) {
        const selectedDoctor = doctors.find((d) => d.id == doctorId);
        const selectedSlot = filteredSlots.find((s) => s.id == slotId);

        return (
            <Container maxWidth="sm" sx={{ mt: 6 }}>
                <Card>
                    <CardContent>
                        <Stack spacing={3} alignItems="center">
                            <Typography variant="h5" fontWeight={500} color="success.main">
                                Change Slot or Book
                            </Typography>

                            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 2, width: "100%" }}>
                                <Typography><b>Doctor:</b> {selectedDoctor?.name}</Typography>
                                <Typography><b>Date:</b> {date}</Typography>
                                <Typography>
                                    <b>Time:</b>{" "}
                                    {new Date(selectedSlot.slot).toLocaleTimeString("en-IN", {
                                        timeZone: "Asia/Kolkata",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </Typography>
                            </Box>

                            <Stack spacing={2} alignItems="center">
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ minWidth: 220 }}
                                    onClick={() => {
                                        setConfirmed(false);
                                        setDoctorId("");
                                        setSlots([]);
                                        setDate("");
                                        setGroup("");
                                        setSlotId("");
                                    }}
                                >
                                    Change Slot
                                </Button>

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
                            </Stack>
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
                            Book Appointment
                        </Typography>

                        <FormControl fullWidth>
                            <InputLabel>Doctor</InputLabel>
                            <Select value={doctorId} label="Doctor" onChange={(e) => setDoctorId(e.target.value)}>
                                {doctors.map((d) => (
                                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
                            {dates.length > 0 && (
                                <FormControl fullWidth>
                                    <InputLabel>Date</InputLabel>
                                    <Select value={date} label="Date" onChange={(e) => { setDate(e.target.value); setGroup(""); }}>
                                        {dates.map((d) => (
                                            <MenuItem key={d} value={d}>{d}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            {groups.length > 0 && (
                                <FormControl fullWidth>
                                    <InputLabel>Time Range</InputLabel>
                                    <Select value={group} label="Time Range" onChange={(e) => setGroup(e.target.value)}>
                                        {groups.map((g) => (
                                            <MenuItem key={g} value={g}>{g.replace("_", " ")}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </Box>

                        {filteredSlots.length > 0 && (
                            <FormControl fullWidth>
                                <InputLabel>Available Slots</InputLabel>
                                <Select value={slotId} label="Available Slots" onChange={(e) => setSlotId(e.target.value)}>
                                    {filteredSlots.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {new Date(s.slot).toLocaleTimeString("en-IN", {
                                                timeZone: "Asia/Kolkata",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {slotId && (
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                onClick={confirmBooking}
                                disabled={confirming}
                                sx={{ alignSelf: "center" }}
                            >
                                {confirming ? "Confirming…" : "Confirm Booking"}
                            </Button>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}
