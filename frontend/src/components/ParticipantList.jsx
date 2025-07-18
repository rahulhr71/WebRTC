export default function ParticipantList({ participants }) {
  return (
    <div className="bg-white border p-4 rounded shadow mb-4 w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Participants ({participants.length})</h3>
      <ul className="list-disc list-inside text-gray-700">
        {participants.map(id => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
  );
}
