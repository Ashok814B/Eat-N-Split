import React, { useState } from "react";

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
  const [isOpen, setisOpen] = useState(false);
  const [FrndList, setFrndList] = useState(initialFriends);
  const [SelectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFreind() {
    setisOpen((isOpen) => !isOpen);
  }

  function addFriend(newFriend) {
    setFrndList((list) => [...list, newFriend]);
  }

  function handleSelectSplitForm(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setisOpen(false);
  }

  function handleSplitCalculation(value) {
    setFrndList((frnds) =>
      frnds.map((frnd) =>
        frnd.id === SelectedFriend.id
          ? { ...frnd, balance: frnd.balance + value }
          : frnd
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          List={FrndList}
          onSelection={handleSelectSplitForm}
          SelectedFriend={SelectedFriend}
        />
        {isOpen && (
          <AddFriendForm onAdd={addFriend} onCloseForm={handleShowAddFreind} />
        )}
        <Button value="addFriend" onClickFunction={handleShowAddFreind}>
          {isOpen ? "Close" : "Add Friend"}
        </Button>
      </div>
      {SelectedFriend && (
        <SplitForm
          person={SelectedFriend}
          updateBalance={handleSplitCalculation}
          closeSplitForm={handleSelectSplitForm}
        />
      )}
    </div>
  );
}

function FriendsList({ List, onSelection, SelectedFriend }) {
  return (
    <ul className="ul">
      {List.map((item) => (
        <Friend
          friend={item}
          key={item.id}
          onSelection={onSelection}
          SelectedFriend={SelectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, SelectedFriend }) {
  const isSelected = friend.id === SelectedFriend?.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.img} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p
        className={
          friend.balance === 0 ? "black" : friend.balance > 0 ? "green" : "red"
        }
      >
        {friend.balance === 0
          ? `You and ${friend.name} are even`
          : friend.balance > 0
          ? `${friend.name} Owes you ${Math.abs(friend.balance)}`
          : `You Owe ${friend.name} ${Math.abs(friend.balance)}`}
      </p>
      <Button value="select" onClickFunction={() => onSelection(friend)}>
        {isSelected ? "close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, onClickFunction }) {
  return (
    <button className="button" onClick={onClickFunction}>
      {children}
    </button>
  );
}

function AddFriendForm({ onAdd, onCloseForm }) {
  const [name, setName] = useState("");
  const [imgURL, setimgURL] = useState("https://i.pravatar.cc/48");
  function handleAddFriend(e) {
    e.preventDefault();
    if (!name || !imgURL) return;

    const id = crypto.randomUUID();
    const newFriend = { id, name, imgURL: `${imgURL}?=${id}`, balance: 0 };

    onAdd(newFriend);
    onCloseForm();
    setName("");
    setimgURL("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>Friend Name</label>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <label>Image URL</label>
      <input type="text" onChange={(e) => setimgURL(e.target.value)} />
      <Button value="Add">Add</Button>
    </form>
  );
}

function SplitForm({ person, updateBalance, closeSplitForm }) {
  const [totalBill, setTotalBill] = useState(0);
  const [YourShare, setYourShare] = useState(0);
  //const [OthersShare, setOthersShare] = useState(0);
  const friendsexpense = totalBill ? totalBill - YourShare : 0;
  const [paidBy, setPaidBy] = useState("You");

  function handleSplitSubmit(e) {
    e.preventDefault();
    if (totalBill === 0 || YourShare === 0) return;

    updateBalance(paidBy === "You" ? friendsexpense : -YourShare);

    closeSplitForm(person);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSplitSubmit}>
      <h2>Split a bill with {person.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        onChange={(e) => setTotalBill(Number(e.target.value))}
      />
      <label>Your Expense</label>
      <input
        type="text"
        value={YourShare}
        onChange={(e) =>
          setYourShare(
            Number(e.target.value) > totalBill
              ? YourShare
              : Number(e.target.value)
          )
        }
      />
      <label>{person.name}s Expense</label>
      <input type="text" disabled value={friendsexpense} />
      <label>Bill Value</label>
      <select onChange={(e) => setPaidBy(e.target.value)}>
        <option value="You">You</option>
        <option value={person.name}>{person.name}</option>
      </select>
      <Button value="splitBill">Split Bill</Button>
    </form>
  );
}
