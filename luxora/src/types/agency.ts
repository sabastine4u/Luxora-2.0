export interface AgencyAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  verified: boolean;
  assigned: number;
  score: number;
  department: string;
  level: string;
  joinDate: string;
  activeLeads: number;
  clientSat: number;
}

export interface AgencyClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  transactions: number;
  agent: string;
  lastComm: string;
}

export interface AgencyLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  budget: string;
  status: string;
  agent: string;
  score: number;
  source: string;
  age: number;
  lastContact: string;
}

export interface AgencyCommission {
  id: string;
  agent: string;
  property: string;
  date: string;
  amount: string;
  status: string;
  dealValue: string;
}
