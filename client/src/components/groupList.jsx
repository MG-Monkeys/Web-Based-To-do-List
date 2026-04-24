import { useState, useEffect } from "react";

export default function GroupList({ User }) {
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    if (!User) {
      return;
    }

    async function getGroups() {
      const response = await fetch(`/users/groups/${User.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data = await response.json();
      setGroupList(data.groups);
    }

    getGroups();
  }, [User]);

  if (!User) return <p>Sign in to join and create groups</p>;

  if (!groupList || groupList.length === 0) {
    return <p>No Groups</p>;
  }

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
