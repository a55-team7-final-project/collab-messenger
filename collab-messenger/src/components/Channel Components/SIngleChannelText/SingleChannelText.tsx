
export default function SingleChannelText ({message}) {
    return (
        <>
        <p>{message.userHandle}:</p>
        <span>{message.text}</span>
        </>
    )
}