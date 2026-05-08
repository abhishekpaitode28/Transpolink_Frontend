export const USER_ROLES={
    Citizen:'Citizen',
    TrafficOfficer:'TrafficOfficer',
    TransportOperator:'TransportOperator',
    Compliance:'Compliance',
    Admin:'Admin',
} as const;


export type UserRole=(typeof USER_ROLES)[keyof typeof USER_ROLES];

//list for dropdown

export const USER_ROLE_OPTIONS:{value:UserRole;label:string}[]=[
    {value:USER_ROLES.Citizen,label:'Citizen'},
    {value:USER_ROLES.Compliance,label:'Compliance'},
    {value:USER_ROLES.TrafficOfficer,label:'Traffic Officer'},
    {value:USER_ROLES.TransportOperator,label:'Transport Operator'},
    {value:USER_ROLES.Admin,label:'Admin'}
]

//set used by guards 

export const ADMIN_ONLY:readonly UserRole[]=[USER_ROLES.Admin];
export const OFFICER_OR_ABOVE:readonly UserRole[]=[USER_ROLES.Admin,USER_ROLES.Compliance,USER_ROLES.TrafficOfficer,USER_ROLES.TransportOperator];
export const COMPLIANCE_OR_ADMIN: readonly UserRole[] = [
  USER_ROLES.Admin,
  USER_ROLES.Compliance,
];

export function roleLabel(role: string | null | undefined): string {
  switch (role) {
    case USER_ROLES.TrafficOfficer:    return 'Traffic Officer';
    case USER_ROLES.TransportOperator: return 'Transport Operator';
    case USER_ROLES.Compliance:        return 'Compliance';
    case USER_ROLES.Admin:             return 'Admin';
    case USER_ROLES.Citizen:           return 'Citizen';
    default:                           return role ?? '—';
  }
}