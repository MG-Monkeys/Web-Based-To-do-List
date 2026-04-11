export default function GroupList({ groupList }) {
  return (
    <div className="group-list">
      <h3>Groups</h3>
      {groupList.map((group) => (
        <div key={group.id} className="group-item">
          <label>
            <input type="checkbox" />
          </label>
          <p>{group.name}</p>
        </div>
      ))}
    </div>
  );
}
