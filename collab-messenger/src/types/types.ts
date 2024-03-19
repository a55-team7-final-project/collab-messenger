

export type User = {
    handle: string;
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    createdOn: string;
    status: 'online' | 'offline' | 'busy' | 'away' | 'in a meeting';
}

export type Meeting = {
    id: string;
    date: Date;
    duration: number;
    participants: User[];
}

export type Group = {
    id: string;
    name: string;
    members: Record<string, User>;
    owner: string;
    channels: Record<string, Channel>;
    meetings: Record<string, Meeting>;
}

export type Channel = {
    id: string;
    title: string;
    participants: User[];
    isPrivate: boolean;
}

export type IndividualChat = {
    id: string;
    chatID: string;
    userHandle: string;
    text: string;
    createdOn: Date;
}

export type UserChatDetailed = {
    id: string;
    messages: { [userHandle: string]: IndividualChat };
    members: User[];
};
