// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";

contract ICEAlerts is Ownable , ReentrancyGuard {

   
    uint tagFees = 10* 10 ** 18; // APECOIN 
    IERC20 public token; // ERC-20 token contract

   uint256 public tagTableId=577; 
   string private constant tagTablePrefix = "icetag";

   uint256 public contactsTableId=591; 
   string private constant contactsTablePrefix = "econtacts";



    struct Tag {
        
        address owner;
        string tagid;
        string cid;
        bool active;
      
    }

    

   

    event NewTag (
        address indexed owner,
        string indexed tagid,
        string indexed cid
    );
    
    event NewICEAdded (
    
        address owner,
        address contactAdress,
        string name
    );

    


    mapping (address => Tag ) public tags;
   

    function withdrawAllTokens() external onlyOwner {
        uint balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Token transfer failed");
    }  

   // Function to create a new tag
    function createTag(string memory _tagId, string memory _cid) external {
        tags[msg.sender] = Tag({
            owner: msg.sender,
            tagid: _tagId,
            cid: _cid,
            active: true
        });

        TablelandDeployments.get().mutate(
    address(this),
    tagTableId,
    SQLHelpers.toInsert(
      tagTablePrefix,
      tagTableId,
      "tagid,cid,owner",
      string.concat(
       SQLHelpers.quote(_tagId),",",SQLHelpers.quote(_cid), 
        ",",
        SQLHelpers.quote(Strings.toHexString(msg.sender)) // Wrap strings in single quotes
      )
    )
  );
        emit NewTag(msg.sender, _tagId, _cid);
    } 
    


    // Function to add an emergency contact
    function addEmergencyContact(address _contactAddress, string memory _name) external {
        
          TablelandDeployments.get().mutate(
    address(this),
    contactsTableId,
    SQLHelpers.toInsert(
      contactsTablePrefix,
      contactsTableId,
      "owner,contactAddress,contact",
      string.concat(
      
        SQLHelpers.quote(Strings.toHexString(msg.sender)), // Wrap strings in single quotes
         SQLHelpers.quote(Strings.toHexString(_contactAddress)),
          SQLHelpers.quote(_name)  
      )
    )
  );
        emit NewICEAdded(msg.sender, _contactAddress, _name);
    }


   function deleteEmergencyContact(address _contactAddress) external {
   string memory filters = string.concat(
    "owner=",
     SQLHelpers.quote(Strings.toHexString(msg.sender)),
     "and contactAddress=",
       SQLHelpers.quote(Strings.toHexString(_contactAddress))
  );

    TablelandDeployments.get().mutate(
    address(this),
    contactsTableId,
    SQLHelpers.toDelete(
      contactsTablePrefix,
      contactsTableId,
      filters
    )
  );
  }


  function updateTagCID(string memory newCID) external {
    Tag storage existingTag = tags[msg.sender];
    require(existingTag.active, "Tag doesn't exist");
    
    existingTag.cid = newCID;
string memory setters = string.concat(
    "cid=",
    SQLHelpers.quote(newCID) // Wrap strings in single quotes
  );
  // Only update the row with the matching `id`
  string memory filters = string.concat(
    "owner=",
    SQLHelpers.quote(Strings.toHexString(msg.sender))
  );
     TablelandDeployments.get().mutate(
    address(this),
    tagTableId,
    SQLHelpers.toUpdate(
      tagTablePrefix,
      tagTableId,
      setters,
      filters
    )
  );
}



}