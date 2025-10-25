/**
 * Contract ABIs for Evenntz Platform on Lisk Network
 * Factory, Implementation, Ticket, Payroll, and Sponsor Vault contracts
 */

export const FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "implementation_", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "organizer", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "proxy", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "organizationName", "type": "string" }
    ],
    "name": "OrganizationProxyCreated",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "organizationName", "type": "string" }
    ],
    "name": "createOrganizationProxy",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "organizer", "type": "address" }
    ],
    "name": "getOrganizerProxy",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "implementation",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const IMPLEMENTATION_ABI = [
  {
    "inputs": [],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "eventId", "type": "bytes32" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "ticketPrice", "type": "uint256" }
    ],
    "name": "EventCreated",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "location", "type": "string" },
      { "internalType": "string", "name": "venue", "type": "string" },
      { "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "uint8", "name": "eventType", "type": "uint8" },
      { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "maxAttendees", "type": "uint256" },
      { "internalType": "uint256", "name": "amountNeededForExpenses", "type": "uint256" },
      { "internalType": "string", "name": "bannerUrl", "type": "string" }
    ],
    "name": "createEvent",
    "outputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" }
    ],
    "name": "getEvent",
    "outputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "id", "type": "bytes32" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string", "name": "location", "type": "string" },
          { "internalType": "string", "name": "venue", "type": "string" },
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          { "internalType": "uint256", "name": "endTime", "type": "uint256" },
          { "internalType": "uint8", "name": "eventType", "type": "uint8" },
          { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" },
          { "internalType": "uint256", "name": "maxAttendees", "type": "uint256" },
          { "internalType": "uint256", "name": "amountNeededForExpenses", "type": "uint256" },
          { "internalType": "string", "name": "bannerUrl", "type": "string" },
          { "internalType": "bool", "name": "isPaid", "type": "bool" }
        ],
        "internalType": "struct LibStorage.EventStruct",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllEvents",
    "outputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "id", "type": "bytes32" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string", "name": "location", "type": "string" },
          { "internalType": "string", "name": "venue", "type": "string" },
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          { "internalType": "uint256", "name": "endTime", "type": "uint256" },
          { "internalType": "uint8", "name": "eventType", "type": "uint8" },
          { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" },
          { "internalType": "uint256", "name": "maxAttendees", "type": "uint256" },
          { "internalType": "uint256", "name": "amountNeededForExpenses", "type": "uint256" },
          { "internalType": "string", "name": "bannerUrl", "type": "string" },
          { "internalType": "bool", "name": "isPaid", "type": "bool" }
        ],
        "internalType": "struct LibStorage.EventStruct[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "workerAddress", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "role", "type": "string" },
      { "internalType": "uint256", "name": "salary", "type": "uint256" },
      { "internalType": "bytes32[]", "name": "assignedEventIds", "type": "bytes32[]" }
    ],
    "name": "createWorker",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWorkers",
    "outputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "id", "type": "bytes32" },
          { "internalType": "address", "name": "workerAddress", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "role", "type": "string" },
          { "internalType": "uint256", "name": "salary", "type": "uint256" },
          { "internalType": "bytes32[]", "name": "assignedEventIds", "type": "bytes32[]" },
          { "internalType": "bool", "name": "isPaid", "type": "bool" }
        ],
        "internalType": "struct LibStorage.WorkerInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" },
      { "internalType": "uint256", "name": "sponsorGoal", "type": "uint256" }
    ],
    "name": "setSponsorshipGoal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" }
    ],
    "name": "fundEvent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "processPayments",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOrganizationName",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const TICKET_ABI = [
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" }
    ],
    "name": "buyTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" }
    ],
    "name": "getTicketsSold",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" }
    ],
    "name": "getRevenue",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const PAYROLL_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "workerAddress", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "role", "type": "string" },
      { "internalType": "uint256", "name": "salary", "type": "uint256" },
      { "internalType": "bytes32[]", "name": "assignedEventIds", "type": "bytes32[]" }
    ],
    "name": "createWorker",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWorkers",
    "outputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "id", "type": "bytes32" },
          { "internalType": "address", "name": "workerAddress", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "role", "type": "string" },
          { "internalType": "uint256", "name": "salary", "type": "uint256" },
          { "internalType": "bytes32[]", "name": "assignedEventIds", "type": "bytes32[]" },
          { "internalType": "bool", "name": "isPaid", "type": "bool" }
        ],
        "internalType": "struct LibStorage.WorkerInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "processWorkerPayments",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const SPONSOR_ABI = [
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" },
      { "internalType": "uint256", "name": "goal", "type": "uint256" }
    ],
    "name": "setSponsorshipGoal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" }
    ],
    "name": "fundEvent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" }
    ],
    "name": "getSponsors",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "sponsorAddress", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "percentage", "type": "uint256" }
        ],
        "internalType": "struct LibStorage.SponsorInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" }
    ],
    "name": "getTotalSponsorship",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "processSponsorPayments",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
