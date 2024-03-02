import { ref, set, remove, update, get } from "firebase/database";
import { db } from "../config/firebase-setup";
import { Meeting } from "../types/types";

export const createMeeting = (groupId: string, meeting: Meeting): Promise<void> => {
    return set(ref(db, `groups/${groupId}/meetings/${meeting.id}`), meeting);
}

export const getMeeting = async (groupId: string, meetingId: string): Promise<Meeting | null> => {
    const snapshot = await get(ref(db, `groups/${groupId}/meetings/${meetingId}`));

    if (!snapshot.exists()) {
        return null;
    }

    const meeting = {
        id: meetingId,
        ...snapshot.val(),
        start: new Date(snapshot.val().start).toString(),
    };

    return meeting;
}

export const updateMeeting = (groupId: string, meetingId: string, meetingInfo: { [key: string]: unknown }): Promise<void> => {
    const meetingRef = ref(db, `groups/${groupId}/meetings/${meetingId}`);
    return update(meetingRef, meetingInfo);
}

export const deleteMeeting = (groupId: string, meetingId: string): Promise<void> => {
    return remove(ref(db, `groups/${groupId}/meetings/${meetingId}`));
}
