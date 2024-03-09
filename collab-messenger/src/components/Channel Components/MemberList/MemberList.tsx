
export default function MemberList ({members}) {

    return (
        <>
        <h3>Members:</h3>
        {members.map((member) => {
            return <p>{member}</p>
        })}
        </>
    )
}