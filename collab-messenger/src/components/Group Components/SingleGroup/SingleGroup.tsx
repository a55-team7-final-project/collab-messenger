

export default function SingleGroup ({group}) {
    return (
        <div>
            <p>{group.name}</p>
            <p>Created By: {group.owner}</p>
            <p>Members: {Object.keys(group.members).length}</p>
            <p>Channels: {Object.keys(group.channels).length}</p>
        </div>
    )
}