
export default function SingleChannelText ({text, userHandle}) {
    return (
        <>
        <h2>Messages:</h2>
        <p>{userHandle}:</p>
        <span>{text}</span>
        </>
    )
}