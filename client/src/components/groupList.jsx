import { useEffect } from "react";

export default function GroupList({ User, userGroups, setUserGroups }) {
  useEffect(() => {
    if (!User) {
      return;
    }

    async function getGroups() {
      try {
        const response = await fetch(`/users/groups/${User.id}`);
        if (!response.ok) throw new Error("Failed to fetch groups");
        const { groups } = await response.json();

        const fullGroups = await Promise.all(
          groups.map(async (groupId) => {
            const res = await fetch(`/groups/${groupId}`);
            return res.json();
          }),
        );

        setUserGroups(fullGroups);
      } catch (e) {
        console.error(e);
      }
    }
    getGroups();
  }, [User, setUserGroups]);

  if (!User) return <p>Sign in to join and create groups</p>;

  if (!userGroups || userGroups.length === 0) {
    return <p>No Groups</p>;
  }

  return (
    <div className="group-list">
      <h5>Groups</h5>
      {userGroups.map((group) => (
        <div key={group._id} className="group-item">
          <label>
            <input type="checkbox" />
          </label>
          <p>{group.groupName}</p>
        </div>
      ))}
    </div>
  );
}
