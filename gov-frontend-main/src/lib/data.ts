import {
  HeartPulse,
  GraduationCap,
  Car,
  Landmark,
  Sprout,
  Zap,
  Home,
  Users,
  Briefcase,
  FileText,
  Building2,
  Ship,
  CheckCircle,
  Clock,
  type LucideIcon,
} from 'lucide-react';

export type Service = {
  title: string;
  description: string;
  department: string;
  departmentIconName: string;
  link: string;
};

export const citizenServices: Service[] = [
  {
    title: 'Aadhaar Card Application',
    description: 'Apply for a new Aadhaar card or update your existing details.',
    department: 'UIDAI',
    departmentIconName: 'FileText',
    link: 'https://services.india.gov.in/service/detail/apply-online-for-aadhaar-card-data-updatecorrection-1',
  },
  {
    title: 'Birth Certificate',
    description: 'Register a new birth and get an official birth certificate.',
    department: 'Municipal Corp',
    departmentIconName: 'FileText',
    link: 'https://services.india.gov.in/service/detail/search-for-birth-certificate-in-andhra-pradesh-1',
  },
  {
    title: "Driver's License",
    description: "Apply for a new driver's license or renew an existing one.",
    department: 'Transport',
    departmentIconName: 'Car',
    link: 'https://parivahan.gov.in/en/faq/new-driver-license-services',
  },
  {
    title: 'Passport Application',
    description: 'Apply for a new Indian passport for international travel.',
    department: 'External Affairs',
    departmentIconName: 'FileText',
    link: 'https://www.passportindia.gov.in/psp/ApplyPassport',
  },
  {
    title: 'Tax Filing',
    description: 'File your annual income tax returns online with ease.',
    department: 'Finance',
    departmentIconName: 'Landmark',
    link: 'https://eportal.incometax.gov.in/iec/foservices/#/login',
  },
  {
    title: 'Voter Registration',
    description: 'Register to vote in upcoming elections and get your voter ID.',
    department: 'Election Commission',
    departmentIconName: 'Users',
    link: 'https://services.india.gov.in/service/detail/register-as-a-new-voter',
  },
  {
    title: 'Housing Assistance',
    description: 'Apply for government housing schemes and subsidies.',
    department: 'Housing',
    departmentIconName: 'Home',
    link: 'https://pmay-urban.gov.in/about',
  },
  {
    title: 'Education Grants',
    description: 'Find and apply for scholarships and grants for students.',
    department: 'Education',
    departmentIconName: 'GraduationCap',
    link: 'https://services.india.gov.in/service/listing?cat_id=68&ln=en&page_no=11',
  },
  {
    title: 'Business Registration',
    description: 'Register a new company or business entity.',
    department: 'Corporate Affairs',
    departmentIconName: 'Briefcase',
    link: 'https://www.startupindia.gov.in/',
  },
  {
    title: 'Tax ID Application',
    description: 'Apply for a PAN card or GSTIN for your business.',
    department: 'Finance',
    departmentIconName: 'Landmark',
    link: 'https://incometaxindia.gov.in/Pages/tax-services/apply-for-pan.aspx',
  },
  {
    title: 'Licensing',
    description: 'Obtain necessary licenses for various business operations.',
    department: 'Commerce',
    departmentIconName: 'FileText',
    link: 'https://www.registerkaro.in/post/types-of-business-licenses',
  },
  {
    title: 'Export Permissions',
    description: 'Get permissions and clearances for exporting goods.',
    department: 'Commerce',
    departmentIconName: 'Ship',
    link: 'https://www.ibm.com/docs/en/cmofz/10.5.0?topic=reference-export-permissions',
  },
  {
    title: 'Public Grievance',
    description: 'File and track grievances against government services.',
    department: 'Social Services',
    departmentIconName: 'Users',
    link: 'https://pgportal.gov.in/',
  },
  {
    title: 'Senior Citizen Pension',
    description: 'Apply for monthly pension schemes for senior citizens.',
    department: 'Social Services',
    departmentIconName: 'Users',
    link: 'https://services.india.gov.in/service/listing?ln=en&cat_id=44',
  },
];

export const departmentalServices: Service[] = [
  {
    title: 'Inter-Department Request',
    description:
      'Submit official requests for information or action to another department.',
    department: 'Admin',
    departmentIconName: 'Building2',
    link: '/services/inter-department-request',
  },
  {
    title: 'Resource Allocation',
    description:
      'Request allocation of budget, personnel, or other resources for projects.',
    department: 'Finance',
    departmentIconName: 'Landmark',
    link: '/services/resource-allocation',
  },
  {
    title: 'Budget Approval',
    description:
      'Submit annual or project-specific budgets for financial approval.',
    department: 'Finance',
    departmentIconName: 'Landmark',
    link: '/services/budget-approval',
  },
  {
    title: 'Policy Review',
    description:
      'Initiate a review of existing policies or propose new ones.',
    department: 'Legal',
    departmentIconName: 'FileText',
    link: '/services/policy-review',
  },
  {
    title: 'Cross-dept Training',
    description: 'Request or schedule training for employees from other departments.',
    department: 'Admin',
    departmentIconName: 'Building2',
    link: '/services/cross-dept-training',
  },
  {
    title: 'IT Support Request',
    description: 'Request IT support for hardware or software issues.',
    department: 'Energy',
    departmentIconName: 'Zap',
    link: '/services/it-support',
  },
];

export const departments = [
  { name: 'Health', icon: HeartPulse },
  { name: 'Education', icon: GraduationCap },
  { name: 'Transport', icon: Car },
  { name: 'Finance', icon: Landmark },
  { name: 'Agriculture', icon: Sprout },
  { name: 'Energy', icon: Zap },
  { name: 'Housing', icon: Home },
  { name: 'Social Services', icon: Users },
  { name: 'Admin', icon: Building2 },
  { name: 'Legal', icon: FileText },
  { name: 'Commerce', icon: Briefcase },
  { name: 'External Affairs', icon: Ship },
  { name: 'UIDAI', icon: FileText },
  { name: 'Municipal Corp', icon: Building2 },
  { name: 'Election Commission', icon: Users },
  { name: 'Corporate Affairs', icon: Briefcase },
];

export const dashboardApplications = [
  {
    service: 'Passport Application',
    id: 'PASS-84351',
    status: 'Approved',
    date: '2023-05-15',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  {
    service: "Driver's License",
    id: 'DL-98765',
    status: 'In Progress',
    date: '2023-06-01',
    icon: Clock,
    color: 'text-yellow-500',
  },
  {
    service: 'Housing Assistance',
    id: 'HA-12345',
    status: 'Approved',
    date: '2023-04-20',
    icon: CheckCircle,
    color: 'text-green-500',
  },
];

export const dashboardNotifications = [
    {
      id: 1,
      message: 'Your passport application has been approved.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      message: 'Reminder: Tax filing deadline is approaching.',
      time: '1 day ago',
      read: false,
    },
    {
      id: 3,
      message: 'New document shared by the Ministry of Finance.',
      time: '3 days ago',
      read: true,
    },
  ];

  export const dashboardTasks = [
    {
      id: 'TSK-1001',
      title: 'Review Budget Proposal Q3',
      description: 'Analyze and provide feedback on the upcoming quarterly budget for digital transformation initiatives.',
      department: 'Finance',
      assignedTo: 'Arjun Mehta',
      dueDate: '2024-03-25',
      priority: 'High',
      status: 'In Progress',
      completed: false,
    },
    {
      id: 'TSK-1002',
      title: 'Update Security Protocols',
      description: 'Ensure all systems are updated to the latest security patch and verify firewall logs.',
      department: 'IT Support',
      assignedTo: 'Priya Sharma',
      dueDate: '2024-03-20',
      priority: 'Medium',
      status: 'Completed',
      completed: false,
    },
    {
      id: 'TSK-1003',
      title: 'Legal Review: WFH Policy',
      description: 'Check legal compliance for the new remote work policy and draft final clauses.',
      department: 'Legal',
      assignedTo: 'Sanjay Gupta',
      dueDate: '2024-03-15',
      priority: 'High',
      status: 'Overdue',
      completed: false,
    },
    {
      id: 'TSK-1004',
      title: 'Schedule Cross-Dept Workshop',
      description: 'Coordinate with Health and Transport for the upcoming workshop on inter-modal transport data.',
      department: 'Admin',
      assignedTo: 'Anjali Rao',
      dueDate: '2024-04-05',
      priority: 'Low',
      status: 'Pending',
      completed: true,
    },
  ];
