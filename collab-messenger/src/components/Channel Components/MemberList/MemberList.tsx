
export default function MemberList ({members}) {

    return (
        <>
        <h3>Members:</h3>
        {members.map((member, index) => {
            return <p key={index} >{member}</p>
        })}
        </>
    )
}