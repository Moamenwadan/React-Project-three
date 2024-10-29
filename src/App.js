import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(true);
  const [friends, setFriends] = useState(initialFriends);
  const [selectFriend, setSelectFriend] = useState(null);
  function handleShowfriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend);
  }
  function handleFriends(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSelectFriend(friend) {
    // setSelectFriend(friend);
    setSelectFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    console.log(value);
    setFriends(
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friends, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          handleSelectFriend={handleSelectFriend}
          selectFriend={selectFriend}
        />
        {showAddFriend && <FormAddFriend handleFriends={handleFriends} />}
        <Button onClick={handleShowfriend}>
          {showAddFriend ? "close" : "Add"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill
          selectFriend={selectFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FriendList({ friends, handleSelectFriend, selectFriend }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.balance}
          handleSelectFriend={handleSelectFriend}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSelectFriend, selectFriend }) {
  const isSelected = friend.id === selectFriend?.id;
  // console.log(isSelected);
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          you owe {friend.name}
          {Math.abs(friend.balance)}$
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owe you
          {Math.abs(friend.balance)}$
        </p>
      ) : (
        <p>you and {friend.name}</p>
      )}
      <Button onClick={() => handleSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ handleFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  function handleSubmit(e) {
    if (!name || !image) return;
    e.preventDefault();
    const newPerson = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    console.log(newPerson);
    handleFriends(newPerson);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label> Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>📷 Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add friend</Button>
    </form>
  );
}
function FormSplitBill({ selectFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = Number(bill) - Number(paidByUser);
  const [whoIsPaid, setWhoIsPaid] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !whoIsPaid) return;
    handleSplitBill(
      whoIsPaid === "user" ? Number(paidByFriend) : Number(-paidByUser)
    );
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split a bill with {selectFriend.name}</h2>
      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>🧔 your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      ></input>
      <label>🧑‍🤝‍🧑 {selectFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}></input>
      <label>🤑 Who paying the bill</label>
      <select value={whoIsPaid} onChange={(e) => setWhoIsPaid(e.target.value)}>
        <option value="user"> you</option>
        <option value="friend">{selectFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
