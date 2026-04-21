export default function GroupList({ groupList }) {
  return (
    <div className="group-list">
      <h5>Groups</h5>
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
