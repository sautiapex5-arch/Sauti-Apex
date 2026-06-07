// Extracted from SautiApex Capital Ventures Limited – Pricing & Engagement Structure.
export type Tier = { name: string; price: string };
export type PackageDef = {
  code: string;
  name: string;
  tagline: string;
  designedFor: string[];
  includes: { group: string; items: string[] }[];
  tiers: Tier[];
  pricingNotes: string[];
};

export const PACKAGES: PackageDef[] = [
  {
    code: "Package 1",
    name: "Startup & Business Formalization",
    tagline: "Foundation Package",
    designedFor: [
      "Startups",
      "Small businesses",
      "Youth enterprises",
      "Informal businesses going formal",
    ],
    includes: [
      {
        group: "Registration & Compliance",
        items: [
          "Business name & limited company registration",
          "KRA PIN setup",
          "VAT registration guidance",
          "Tax Compliance Certificate",
          "AGPO registration support",
          "Business permit guidance",
          "NSSF / SHA setup",
          "Postal address setup",
        ],
      },
      {
        group: "Branding & Identity",
        items: [
          "Logo design",
          "Company profile",
          "Letterhead, invoice & receipt templates",
          "Business cards, flyers, brochures",
          "Social media branding",
        ],
      },
      {
        group: "Business Structuring",
        items: [
          "Basic workflow structuring",
          "Operational advisory",
          "Startup strategy consultation",
          "Business model structuring",
          "Recordkeeping systems & templates",
        ],
      },
      {
        group: "Digital",
        items: ["Basic website", "Email setup", "Social media integration"],
      },
    ],
    tiers: [
      { name: "Basic Startup", price: "Ksh 45,000 – 85,000" },
      { name: "Standard Startup", price: "Ksh 85,000 – 180,000" },
      { name: "Premium Startup", price: "Ksh 180,000 – 350,000" },
    ],
    pricingNotes: [
      "Scope & number of deliverables",
      "Complexity & compliance requirements",
      "Branding requirements",
      "Website functionality",
    ],
  },
  {
    code: "Package 2",
    name: "Operational Modernization & Systems Transformation",
    tagline: "Structure & Automation Package",
    designedFor: [
      "Existing businesses",
      "Garages",
      "SMEs",
      "Family businesses",
      "Operationally unstable enterprises",
      "Businesses moving off manual systems",
    ],
    includes: [
      {
        group: "Operational Structuring",
        items: [
          "Workflow restructuring",
          "SOP development",
          "Accountability systems",
          "Team structure optimization",
          "Reporting structures",
          "Operational diagnostics",
        ],
      },
      {
        group: "Systems & Automation",
        items: [
          "Management systems",
          "Attendance systems",
          "Garage management systems",
          "Customer management systems",
          "Reporting dashboards",
          "Inventory systems",
          "Digital workflow automation",
        ],
      },
      {
        group: "Business Intelligence",
        items: [
          "Operational analytics",
          "Performance tracking",
          "Productivity systems",
          "Financial coordination frameworks",
          "Internal monitoring systems",
        ],
      },
      {
        group: "Digital Infrastructure",
        items: [
          "Advanced websites",
          "CRM systems",
          "Internal portals",
          "Client engagement systems",
          "Digital reporting tools",
        ],
      },
      {
        group: "Strategic Support",
        items: [
          "Leadership advisory",
          "Operational coaching",
          "Crisis stabilization",
          "Governance structuring",
          "Staff coordination support",
        ],
      },
    ],
    tiers: [
      { name: "Basic Modernization", price: "Ksh 150,000 – 350,000" },
      { name: "Advanced Modernization", price: "Ksh 350,000 – 850,000" },
      { name: "Enterprise Transformation", price: "Ksh 850,000 – 3,500,000+" },
    ],
    pricingNotes: [
      "System complexity & number of departments",
      "Automation requirements",
      "Staff size & data migration",
      "Custom software requirements",
      "Duration of engagement",
    ],
  },
  {
    code: "Package 3",
    name: "Scalability, Expansion & Investment Readiness",
    tagline: "Growth & Expansion Package",
    designedFor: [
      "Growing SMEs",
      "Tendering companies",
      "Contractors & suppliers",
      "Investors",
      "Businesses seeking funding",
      "Organizations entering procurement ecosystems",
    ],
    includes: [
      {
        group: "Expansion Structuring",
        items: [
          "Scalability frameworks",
          "Branch expansion systems",
          "Operational scaling & diagnostics",
          "Franchise structuring guidance",
          "Multi-branch coordination",
        ],
      },
      {
        group: "Investment Readiness",
        items: [
          "Investor packaging",
          "Pitch deck coordination",
          "Business valuation coordination",
          "Financial structuring",
          "Investment documentation support",
          "Resource mobilization",
        ],
      },
      {
        group: "Tendering & Procurement",
        items: [
          "Tender readiness",
          "Capability statements",
          "Procurement structuring",
          "Bid support coordination",
          "Contract execution systems",
          "Supplier positioning",
          "Compliance coordination",
          "Project accountability systems",
        ],
      },
      {
        group: "Market Intelligence",
        items: [
          "Competition analysis",
          "Market positioning",
          "Location viability analysis",
          "Business potentiality analysis",
          "Expansion forecasting",
        ],
      },
      {
        group: "Strategic Governance",
        items: [
          "Organizational governance systems",
          "Executive coordination frameworks",
          "Institutional structuring",
          "Stakeholder engagement systems",
        ],
      },
    ],
    tiers: [
      { name: "SME Expansion", price: "Ksh 350,000 – 950,000" },
      { name: "Procurement & Tendering", price: "Ksh 250,000 – 1,500,000+" },
      { name: "Investment & Scalability", price: "Ksh 1,000,000 – 5,000,000+" },
    ],
    pricingNotes: [
      "Project size & funding requirements",
      "Tender complexity",
      "Institutional scope",
      "System requirements",
      "Strategic coordination level",
      "Consultancy duration",
    ],
  },
];

export const RETAINERS: Tier[] = [
  { name: "Startup Advisory Retainer", price: "Ksh 25,000 – 80,000 / month" },
  { name: "SME Operational Retainer", price: "Ksh 80,000 – 250,000 / month" },
  { name: "Enterprise Strategic Retainer", price: "Ksh 250,000 – 1,500,000+ / month" },
];

export const PHASES = [
  {
    code: "Phase 1",
    name: "Consultation & Diagnosis",
    items: ["Needs assessment", "Operational review", "Systems evaluation", "Strategic analysis"],
  },
  {
    code: "Phase 2",
    name: "Proposal & Roadmap",
    items: ["Scope definition", "Pricing proposal", "Strategic roadmap", "Timeline development"],
  },
  {
    code: "Phase 3",
    name: "Implementation",
    items: ["Structuring", "Automation", "Branding", "Systems deployment", "Coordination support"],
  },
  {
    code: "Phase 4",
    name: "Monitoring & Optimization",
    items: ["Performance review", "Adjustments", "Staff support", "Sustainability planning"],
  },
];
