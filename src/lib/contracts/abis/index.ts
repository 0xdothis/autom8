// Contract ABIs - Import JSON artifacts
import EventFactoryJson from "./EventFactory.json";
import EventImplementationJson from "./EventImplementation.json";
import EventTicketJson from "./EventTicket.json";
import GlobalEventRegistry from "./GlobalEventRegistry.json";

// Export ABIs only (the abi arrays)
export const eventFactoryAbi = EventFactoryJson.abi;
export const eventImplementationAbi = EventImplementationJson.abi;
export const eventTicketAbi = EventTicketJson.abi;
export const globalEventRegistryAbi = GlobalEventRegistry.abi;

// Note: Payroll and SponsorVault functions are now in EventImplementation contract
// They are accessed via the proxy, not as separate contracts
