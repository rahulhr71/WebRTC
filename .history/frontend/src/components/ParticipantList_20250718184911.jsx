export default function ParticipantList({ participants }) {
  return (
    <div className="bg-gray-100 p-2 rounded shadow mb-2">
      <h3 className="font-bold mb-2">Participants: {participants.length}</h3>
      <ul>
        {participants.map(id => <li key={id}>{id}</li>)}
      </ul>
    </div>
  );
}

