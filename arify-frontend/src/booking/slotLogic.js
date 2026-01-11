// src/booking/slotLogic.js
// === PORTED DIRECTLY FROM V1 db.js (NO LOGIC CHANGES) ===

// --------------------------------------------------
// IST HELPERS
// --------------------------------------------------
export function istDateString(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return d
        .toLocaleString("en-CA", {
            timeZone: "Asia/Kolkata",
            hour12: false
        })
        .slice(0, 10); // YYYY-MM-DD
}

export function istTimeString(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit"
    });
}

// --------------------------------------------------
// SLOT GROUP DEFINITIONS (UNCHANGED FROM V1)
// --------------------------------------------------
export const GROUP_RANGES = {
    morning: ["09:00", "11:00"],
    before_lunch: ["11:00", "13:00"],
    after_lunch: ["14:00", "16:00"],
    evening: ["16:00", "18:00"],
    late_evening: ["18:00", "20:00"]
};

// --------------------------------------------------
// AVAILABLE DATES (IST, FUTURE ONLY) — V1 LOGIC
// --------------------------------------------------
export function getAvailableDates(slots) {
    const nowIST = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const todayIST = nowIST.toISOString().slice(0, 10);

    const dates = new Set(slots.map(s => istDateString(s.slot)));
    return Array.from(dates).filter(d => d >= todayIST).sort();
}

// --------------------------------------------------
// AVAILABLE TIME GROUPS — V1 LOGIC
// --------------------------------------------------
export function getAvailableGroups(slots, date) {
    const avail = new Set();

    slots.forEach(s => {
        const istDate = istDateString(s.slot);
        if (istDate !== date) return;

        const istTime = istTimeString(s.slot);

        for (const [group, [start, end]] of Object.entries(GROUP_RANGES)) {
            if (istTime >= start && istTime < end) {
                avail.add(group);
            }
        }
    });

    return Array.from(avail);
}

// --------------------------------------------------
// SLOTS FOR GROUP (EXPIRED SLOT FILTER) — V1 FINAL
// --------------------------------------------------
export function getSlotsForGroup(slots, date, group) {
    const [start, end] = GROUP_RANGES[group] || [];
    if (!start || !end) return [];

    const nowIST = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const todayIST = nowIST.toISOString().slice(0, 10);
    const nowTimeIST = istTimeString(nowIST);

    return slots
        .map(s => {
            return {
                id: s.id,
                slot: s.slot,
                istDate: istDateString(s.slot),
                istTime: istTimeString(s.slot)
            };
        })
        .filter(s => {
            if (s.istDate !== date) return false;
            if (!(s.istTime >= start && s.istTime < end)) return false;

            // 🔥 expired slot filter (V1 fix: < not <=)
            if (date === todayIST && s.istTime < nowTimeIST) return false;

            return true;
        })
        .sort((a, b) => new Date(a.slot) - new Date(b.slot));
}
