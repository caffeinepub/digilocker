import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Document = {
    id : Nat;
    name : Text;
    docType : Text;
    issuer : Text;
    status : Text;
    uploadDate : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  let documents = Map.empty<Principal, Map.Map<Nat, Document>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Document Functions
  public shared ({ caller }) func addDocument(document : Document) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add documents");
    };
    
    let userDocs = switch (documents.get(caller)) {
      case (null) {
        let newDocs = Map.empty<Nat, Document>();
        newDocs.add(document.id, document);
        documents.add(caller, newDocs);
      };
      case (?docs) {
        docs.add(document.id, document);
      };
    };
  };

  public query ({ caller }) func getCallerDocuments() : async [Document] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their documents");
    };
    
    switch (documents.get(caller)) {
      case (null) { [] };
      case (?docs) {
        let docsArray = docs.values().toArray();
        docsArray.sort(func(a : Document, b : Document) : Order.Order {
          Nat.compare(a.id, b.id)
        });
      };
    };
  };

  public shared ({ caller }) func verifyDocument(docId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify documents");
    };

    for (userDocs in documents.values()) {
      switch (userDocs.get(docId)) {
        case (null) {};
        case (?document) {
          let verifiedDoc = {
            id = document.id;
            name = document.name;
            docType = document.docType;
            issuer = document.issuer;
            status = "verified";
            uploadDate = document.uploadDate;
          };
          userDocs.add(docId, verifiedDoc);
          return;
        };
      };
    };
    Runtime.trap("Document not found");
  };

  public query ({ caller }) func getStats() : async { totalDocs : Nat; totalUsers : Nat } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view stats");
    };

    var totalDocs = 0;
    for (userDocs in documents.values()) {
      totalDocs += userDocs.size();
    };

    {
      totalDocs = totalDocs;
      totalUsers = documents.size();
    };
  };
};
