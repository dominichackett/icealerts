export const  iceContractAddress = "0x7EC6B11c8C440359D9deD90fE3b3555fA4E8B2bE"
export const iceContractABI = [
    'function  withdrawAllTokens() external',
    'function  createTag(string memory _tagId, string memory _cid) external',
    'function  addEmergencyContact(address _contactAddress, string memory _name) external',
    'function  deleteEmergencyContact(address _contactAddress) external',
    'function updateTagCID(string memory newCID) external'
    // Add more function headers as needed
  ];


  /// Table Controller address  0x15e6D4d7dCAf155e60bDC251b8012b860F1CD04d