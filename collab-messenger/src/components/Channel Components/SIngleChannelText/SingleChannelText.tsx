
export default function SingleChannelText ({text, userHandle}) {
    return (
        <>
        <p>{userHandle}:</p>
        <span>{text}</span>
        </>
    )
}