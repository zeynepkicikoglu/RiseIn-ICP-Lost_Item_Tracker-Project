import React, { useState } from "react";
import { motoko_backend } from "declarations/motoko_backend";

function App() {
  const [greeting, setGreeting] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemLocation, setItemLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [disasterType, setDisasterType] = useState("");
  const [itemIdToDelete, setItemIdToDelete] = useState("");
  const [itemIdToFind, setItemIdToFind] = useState("");
  const [foundItem, setFoundItem] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const newItem = {
      description: itemName,
      location: itemLocation,
      contactNumber: contactNumber,
      disasterType: disasterType,
    };

    motoko_backend.createLostItem(newItem).then((itemId) => {
      setGreeting(`Item created with ID: ${itemId}`);
    });
  }

  function handleDelete(event) {
    event.preventDefault();
    if (!itemIdToDelete) {
      setGreeting("Please provide an item ID to delete.");
      return;
    }
    const itemId = parseInt(itemIdToDelete, 10);

    motoko_backend.deleteLostItem(itemId).then((deleted) => {
      if (deleted) {
        setGreeting(`Item with ID ${itemIdToDelete} deleted successfully.`);
        // Reset the itemIdToDelete state after successful deletion
        setItemIdToDelete("");
      } else {
        setGreeting(`Item with ID ${itemIdToDelete} not found.`);
      }
    });
  }

  function handleFind(event) {
    event.preventDefault();
    if (!itemIdToFind) {
      setGreeting("Please provide an item ID to find.");
      return;
    }

    const itemId = parseInt(itemIdToFind, 10);

    motoko_backend.findLostItem(itemId).then((item) => {
      if (item) {
        setFoundItem(item);
        setGreeting(`Item found with ID ${itemIdToFind}`);
      } else {
        setGreeting(`Item with ID ${itemIdToFind} not found.`);
      }
    });
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="itemName">Item Name: </label>
        <input
          id="itemName"
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <br />
        <label htmlFor="itemLocation">Item Location: </label>
        <input
          id="itemLocation"
          type="text"
          value={itemLocation}
          onChange={(e) => setItemLocation(e.target.value)}
        />
        <br />
        <label htmlFor="contactNumber">Contact Number: </label>
        <input
          id="contactNumber"
          type="text"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
        <br />
        <label htmlFor="disasterType">Disaster Type: </label>
        <input
          id="disasterType"
          type="text"
          value={disasterType}
          onChange={(e) => setDisasterType(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      <form onSubmit={handleDelete}>
        <label htmlFor="itemIdToDelete">Item ID to Delete: </label>
        <input
          id="itemIdToDelete"
          type="text"
          value={itemIdToDelete}
          onChange={(e) => setItemIdToDelete(e.target.value)}
        />
        <button type="submit">Delete Item</button>
      </form>

      <form onSubmit={handleFind}>
        <label htmlFor="itemIdToFind">Item ID to Find: </label>
        <input
          id="itemIdToFind"
          type="text"
          value={itemIdToFind}
          onChange={(e) => setItemIdToFind(e.target.value)}
        />
        <button type="submit">Find Item</button>
      </form>

      {foundItem && (
        <div>
          <h3>Found Item</h3>
          <p>Description: {foundItem.description}</p>
          <p>Location: {foundItem.location}</p>
          <p>Contact Number: {foundItem.contactNumber}</p>
          <p>Disaster Type: {foundItem.disasterType}</p>
        </div>
      )}

      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;
