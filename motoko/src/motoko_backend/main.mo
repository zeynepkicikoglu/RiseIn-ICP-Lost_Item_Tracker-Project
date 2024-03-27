import Nat32 "mo:base/Nat32";
import Trie "mo:base/Trie";
import Option "mo:base/Option";
import Bool "mo:base/Bool";

actor LostItemsTracker {

  public type LostItemId = Nat32;

  public type LostItem = {
    description: Text;
    location: Text;
    contactNumber: Text;
    disasterType: Text;
  };

  private stable var nextLostItemId: LostItemId = 0;

  private stable var lostItemRegistry: Trie.Trie<LostItemId, LostItem> = Trie.empty();


  public func createLostItem(item: LostItem) : async LostItemId {
    let itemId = nextLostItemId;
    nextLostItemId += 1;
    lostItemRegistry := Trie.replace(
      lostItemRegistry,
      key(itemId),
      Nat32.equal,
      ?item
    ).0;
    itemId
  };

  public query func findLostItem(itemId: LostItemId) : async ?LostItem {
    let result = Trie.find(lostItemRegistry, key(itemId), Nat32.equal);
    result
  };

  public func updateLostItem(itemId: LostItemId, newItem: LostItem) : async Bool {
    let result = Trie.find(lostItemRegistry, key(itemId), Nat32.equal);
    let exists = Option.isSome(result);
    if(exists) {
      lostItemRegistry := Trie.replace(
        lostItemRegistry,
        key(itemId),
        Nat32.equal,
        ?newItem
      ).0;
    };
    exists
  };

  public func deleteLostItem(itemId: LostItemId) : async Bool {
    let result = Trie.find(lostItemRegistry, key(itemId), Nat32.equal);
    let exists = Option.isSome(result);
    if(exists) {
      lostItemRegistry := Trie.replace(
        lostItemRegistry,
        key(itemId),
        Nat32.equal,
        null
      ).0;
    };
    exists
  };

  private func key(x: LostItemId) : Trie.Key<LostItemId> {
    { hash = x; key = x };
  };

}
