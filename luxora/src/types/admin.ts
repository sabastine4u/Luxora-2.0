export interface AdminAgent {
  id: string;
  name: string;
  agency: string;
  deals: number;
  joined: string;
  status: string;
}

export interface AdminAgency {
  id: string;
  name: string;
  agents: number;
  listings: number;
  joined: string;
  status: string;
}

export interface AdminBuyer {
  id: string;
  name: string;
  email: string;
  saved: number;
  joined: string;
  lastActive: string;
  status: string;
}

export interface AdminOwner {
  id: string;
  name: string;
  email: string;
  properties: number;
  joined: string;
  status: string;
}

export interface AdminListing {
  id: string;
  title: string;
  owner: string;
  location: string;
  price: string;
  status: string;
  priority: string;
}

export interface AdminVerification {
  id: string;
  type: string;
  title: string;
  submitter: string;
  date: string;
  status: string;
}

export interface AdminComplaint {
  id: string;
  type: string;
  user: string;
  target: string;
  status: string;
  priority: string;
  date: string;
}

export interface AdminTransaction {
  id: string;
  property: string;
  agency: string;
  value: string;
  fee: string;
}
