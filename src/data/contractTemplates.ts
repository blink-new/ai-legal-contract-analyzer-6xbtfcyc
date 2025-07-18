import type { ContractTemplate } from '@/types/contractGeneration'

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement (NDA)',
    description: 'Protect confidential information shared between parties',
    category: 'legal',
    complexity: 'simple',
    estimatedPages: 3,
    jurisdictions: ['US', 'US-DE', 'US-CA', 'MX', 'JP', 'RU', 'CN', 'AE', 'IN', 'UK', 'EU', 'CA'],
    riskAreas: ['Definition of confidential information', 'Duration of confidentiality', 'Exceptions to confidentiality'],
    seoKeywords: ['NDA template', 'confidentiality agreement', 'startup legal documents'],
    fields: [
      {
        id: 'nda_type',
        name: 'nda_type',
        label: 'NDA Type',
        type: 'radio',
        required: true,
        options: [
          { value: 'mutual', label: 'Mutual (both parties share confidential info)' },
          { value: 'one_way', label: 'One-way (only one party shares confidential info)' }
        ]
      },
      {
        id: 'disclosing_party',
        name: 'disclosing_party',
        label: 'Disclosing Party Name',
        type: 'text',
        required: true,
        placeholder: 'Company or individual name'
      },
      {
        id: 'receiving_party',
        name: 'receiving_party',
        label: 'Receiving Party Name',
        type: 'text',
        required: true,
        placeholder: 'Company or individual name'
      },
      {
        id: 'purpose',
        name: 'purpose',
        label: 'Purpose of Disclosure',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the business purpose for sharing confidential information'
      },
      {
        id: 'duration',
        name: 'duration',
        label: 'Confidentiality Duration (years)',
        type: 'select',
        required: true,
        options: [
          { value: '2', label: '2 years' },
          { value: '3', label: '3 years' },
          { value: '5', label: '5 years' },
          { value: 'indefinite', label: 'Indefinite' }
        ]
      }
    ],
    clauses: [
      {
        id: 'definition_clause',
        title: 'Definition of Confidential Information',
        content: 'Confidential Information includes all non-public information...',
        isOptional: false,
        category: 'core',
        riskLevel: 'high'
      }
    ]
  },
  {
    id: 'safe_agreement',
    name: 'SAFE Agreement',
    description: 'Simple Agreement for Future Equity - investor funding document',
    category: 'investment',
    complexity: 'complex',
    estimatedPages: 5,
    jurisdictions: ['US', 'US-DE', 'US-CA', 'MX', 'JP', 'RU', 'CN', 'AE', 'IN'],
    riskAreas: ['Valuation cap', 'Discount rate', 'Conversion triggers', 'Pro rata rights'],
    seoKeywords: ['SAFE agreement', 'startup funding', 'equity investment', 'Y Combinator'],
    fields: [
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true,
        placeholder: 'Your startup company name'
      },
      {
        id: 'investor_name',
        name: 'investor_name',
        label: 'Investor Name',
        type: 'text',
        required: true,
        placeholder: 'Individual or entity investing'
      },
      {
        id: 'investment_amount',
        name: 'investment_amount',
        label: 'Investment Amount ($)',
        type: 'number',
        required: true,
        validation: { min: 1000, message: 'Minimum investment is $1,000' }
      },
      {
        id: 'valuation_cap',
        name: 'valuation_cap',
        label: 'Valuation Cap ($)',
        type: 'number',
        required: false,
        helpText: 'Maximum company valuation for conversion'
      },
      {
        id: 'discount_rate',
        name: 'discount_rate',
        label: 'Discount Rate (%)',
        type: 'number',
        required: false,
        validation: { min: 0, max: 50 },
        helpText: 'Discount on future round price'
      },
      {
        id: 'safe_type',
        name: 'safe_type',
        label: 'SAFE Type',
        type: 'select',
        required: true,
        options: [
          { value: 'cap_only', label: 'Valuation Cap Only' },
          { value: 'discount_only', label: 'Discount Only' },
          { value: 'cap_and_discount', label: 'Valuation Cap and Discount' },
          { value: 'mfn', label: 'Most Favored Nation (MFN)' }
        ]
      }
    ],
    clauses: []
  },
  {
    id: 'founders_agreement',
    name: 'Founders Agreement',
    description: 'Define roles, equity, and responsibilities among co-founders',
    category: 'business',
    complexity: 'complex',
    estimatedPages: 8,
    jurisdictions: ['US', 'US-DE', 'US-CA', 'MX', 'JP', 'RU', 'CN', 'AE', 'IN', 'UK', 'CA'],
    riskAreas: ['Equity distribution', 'Vesting schedules', 'Decision making', 'Exit provisions'],
    seoKeywords: ['founders agreement', 'co-founder contract', 'startup equity', 'vesting schedule'],
    fields: [
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true
      },
      {
        id: 'founders',
        name: 'founders',
        label: 'Founders Information',
        type: 'textarea',
        required: true,
        placeholder: 'List each founder with name, role, and equity percentage'
      },
      {
        id: 'vesting_period',
        name: 'vesting_period',
        label: 'Vesting Period (years)',
        type: 'select',
        required: true,
        options: [
          { value: '3', label: '3 years' },
          { value: '4', label: '4 years' },
          { value: '5', label: '5 years' }
        ]
      },
      {
        id: 'cliff_period',
        name: 'cliff_period',
        label: 'Cliff Period (months)',
        type: 'select',
        required: true,
        options: [
          { value: '6', label: '6 months' },
          { value: '12', label: '12 months' },
          { value: '24', label: '24 months' }
        ]
      }
    ],
    clauses: []
  },
  {
    id: 'ip_assignment',
    name: 'IP Assignment Agreement',
    description: 'Transfer intellectual property rights to the company',
    category: 'intellectual-property',
    complexity: 'medium',
    estimatedPages: 4,
    jurisdictions: ['US-DE', 'US-CA', 'UK', 'EU', 'CA'],
    riskAreas: ['Scope of IP transfer', 'Prior inventions', 'Work for hire provisions'],
    seoKeywords: ['IP assignment', 'intellectual property', 'patent assignment', 'copyright transfer'],
    fields: [
      {
        id: 'assignor_name',
        name: 'assignor_name',
        label: 'Assignor Name (Person transferring IP)',
        type: 'text',
        required: true
      },
      {
        id: 'assignee_name',
        name: 'assignee_name',
        label: 'Assignee Name (Company receiving IP)',
        type: 'text',
        required: true
      },
      {
        id: 'ip_description',
        name: 'ip_description',
        label: 'Description of Intellectual Property',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the IP being transferred (patents, trademarks, copyrights, etc.)'
      },
      {
        id: 'consideration',
        name: 'consideration',
        label: 'Consideration ($)',
        type: 'number',
        required: true,
        helpText: 'Payment amount for the IP transfer'
      }
    ],
    clauses: []
  },
  {
    id: 'employment_agreement',
    name: 'Employment Agreement',
    description: 'Comprehensive employment contract for key hires',
    category: 'employment',
    complexity: 'medium',
    estimatedPages: 6,
    jurisdictions: ['US', 'US-DE', 'US-CA', 'MX', 'JP', 'RU', 'CN', 'AE', 'IN', 'UK', 'EU', 'CA'],
    riskAreas: ['Compensation structure', 'Termination clauses', 'Non-compete provisions', 'Benefits'],
    seoKeywords: ['employment contract', 'job agreement', 'startup hiring', 'employee contract'],
    fields: [
      {
        id: 'employee_name',
        name: 'employee_name',
        label: 'Employee Name',
        type: 'text',
        required: true
      },
      {
        id: 'job_title',
        name: 'job_title',
        label: 'Job Title',
        type: 'text',
        required: true
      },
      {
        id: 'salary',
        name: 'salary',
        label: 'Annual Salary',
        type: 'number',
        required: true
      },
      {
        id: 'start_date',
        name: 'start_date',
        label: 'Start Date',
        type: 'date',
        required: true
      },
      {
        id: 'equity_percentage',
        name: 'equity_percentage',
        label: 'Equity Percentage (%)',
        type: 'number',
        required: false,
        validation: { min: 0, max: 100 }
      }
    ],
    clauses: []
  },
  {
    id: 'msa',
    name: 'Master Service Agreement (MSA)',
    description: 'Framework agreement for ongoing service relationships',
    category: 'business',
    complexity: 'complex',
    estimatedPages: 10,
    jurisdictions: ['US-DE', 'US-CA', 'UK', 'EU', 'CA'],
    riskAreas: ['Service level agreements', 'Payment terms', 'Liability limitations', 'Termination rights'],
    seoKeywords: ['MSA agreement', 'service contract', 'vendor agreement', 'business contract'],
    fields: [
      {
        id: 'service_provider',
        name: 'service_provider',
        label: 'Service Provider Name',
        type: 'text',
        required: true
      },
      {
        id: 'client_name',
        name: 'client_name',
        label: 'Client Name',
        type: 'text',
        required: true
      },
      {
        id: 'services_description',
        name: 'services_description',
        label: 'Description of Services',
        type: 'textarea',
        required: true,
        placeholder: 'Detailed description of services to be provided'
      },
      {
        id: 'payment_terms',
        name: 'payment_terms',
        label: 'Payment Terms',
        type: 'select',
        required: true,
        options: [
          { value: 'net_15', label: 'Net 15 days' },
          { value: 'net_30', label: 'Net 30 days' },
          { value: 'net_45', label: 'Net 45 days' },
          { value: 'upon_delivery', label: 'Upon delivery' }
        ]
      }
    ],
    clauses: []
  },
  {
    id: 'term_sheet',
    name: 'Investment Term Sheet',
    description: 'Non-binding outline of investment terms',
    category: 'investment',
    complexity: 'complex',
    estimatedPages: 4,
    jurisdictions: ['US-DE', 'US-CA', 'UK'],
    riskAreas: ['Valuation terms', 'Liquidation preferences', 'Board composition', 'Anti-dilution provisions'],
    seoKeywords: ['term sheet', 'investment terms', 'venture capital', 'startup funding'],
    fields: [
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true
      },
      {
        id: 'investor_name',
        name: 'investor_name',
        label: 'Lead Investor Name',
        type: 'text',
        required: true
      },
      {
        id: 'investment_amount',
        name: 'investment_amount',
        label: 'Investment Amount ($)',
        type: 'number',
        required: true
      },
      {
        id: 'pre_money_valuation',
        name: 'pre_money_valuation',
        label: 'Pre-Money Valuation ($)',
        type: 'number',
        required: true
      },
      {
        id: 'liquidation_preference',
        name: 'liquidation_preference',
        label: 'Liquidation Preference',
        type: 'select',
        required: true,
        options: [
          { value: '1x_non_participating', label: '1x Non-Participating' },
          { value: '1x_participating', label: '1x Participating' },
          { value: '2x_non_participating', label: '2x Non-Participating' }
        ]
      }
    ],
    clauses: []
  },
  {
    id: 'consultant_agreement',
    name: 'Consultant Agreement',
    description: 'Independent contractor agreement for consultants',
    category: 'employment',
    complexity: 'medium',
    estimatedPages: 5,
    jurisdictions: ['US-DE', 'US-CA', 'UK', 'EU', 'CA'],
    riskAreas: ['Independent contractor classification', 'Payment terms', 'IP ownership', 'Termination'],
    seoKeywords: ['consultant agreement', 'independent contractor', 'freelancer contract'],
    fields: [
      {
        id: 'consultant_name',
        name: 'consultant_name',
        label: 'Consultant Name',
        type: 'text',
        required: true
      },
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true
      },
      {
        id: 'services_description',
        name: 'services_description',
        label: 'Services Description',
        type: 'textarea',
        required: true
      },
      {
        id: 'hourly_rate',
        name: 'hourly_rate',
        label: 'Hourly Rate ($)',
        type: 'number',
        required: true
      },
      {
        id: 'project_duration',
        name: 'project_duration',
        label: 'Project Duration',
        type: 'text',
        required: true,
        placeholder: 'e.g., 3 months, ongoing, specific end date'
      }
    ],
    clauses: []
  },
  {
    id: 'advisor_agreement',
    name: 'Advisor Agreement',
    description: 'Agreement with startup advisors including equity compensation',
    category: 'business',
    complexity: 'medium',
    estimatedPages: 4,
    jurisdictions: ['US-DE', 'US-CA'],
    riskAreas: ['Equity compensation', 'Vesting schedule', 'Advisory duties', 'Confidentiality'],
    seoKeywords: ['advisor agreement', 'startup advisor', 'equity compensation', 'advisory board'],
    fields: [
      {
        id: 'advisor_name',
        name: 'advisor_name',
        label: 'Advisor Name',
        type: 'text',
        required: true
      },
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true
      },
      {
        id: 'equity_percentage',
        name: 'equity_percentage',
        label: 'Equity Percentage (%)',
        type: 'number',
        required: true,
        validation: { min: 0.1, max: 5 },
        helpText: 'Typical advisor equity ranges from 0.1% to 2%'
      },
      {
        id: 'vesting_period',
        name: 'vesting_period',
        label: 'Vesting Period (months)',
        type: 'select',
        required: true,
        options: [
          { value: '12', label: '12 months' },
          { value: '24', label: '24 months' },
          { value: '36', label: '36 months' }
        ]
      },
      {
        id: 'advisory_duties',
        name: 'advisory_duties',
        label: 'Advisory Duties',
        type: 'textarea',
        required: true,
        placeholder: 'Describe expected advisory services and time commitment'
      }
    ],
    clauses: []
  },
  {
    id: 'stock_purchase_agreement',
    name: 'Stock Purchase Agreement',
    description: 'Agreement for the purchase and sale of company stock',
    category: 'investment',
    complexity: 'complex',
    estimatedPages: 12,
    jurisdictions: ['US-DE', 'US-CA'],
    riskAreas: ['Purchase price', 'Representations and warranties', 'Closing conditions', 'Indemnification'],
    seoKeywords: ['stock purchase agreement', 'equity sale', 'share purchase', 'investment agreement'],
    fields: [
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true
      },
      {
        id: 'purchaser_name',
        name: 'purchaser_name',
        label: 'Purchaser Name',
        type: 'text',
        required: true
      },
      {
        id: 'share_class',
        name: 'share_class',
        label: 'Share Class',
        type: 'select',
        required: true,
        options: [
          { value: 'common', label: 'Common Stock' },
          { value: 'preferred_a', label: 'Preferred Stock Series A' },
          { value: 'preferred_b', label: 'Preferred Stock Series B' }
        ]
      },
      {
        id: 'number_of_shares',
        name: 'number_of_shares',
        label: 'Number of Shares',
        type: 'number',
        required: true
      },
      {
        id: 'price_per_share',
        name: 'price_per_share',
        label: 'Price per Share ($)',
        type: 'number',
        required: true
      }
    ],
    clauses: []
  },
  {
    id: 'operating_agreement',
    name: 'LLC Operating Agreement',
    description: 'Governing document for Limited Liability Company operations',
    category: 'business',
    complexity: 'complex',
    estimatedPages: 15,
    jurisdictions: ['US-DE', 'US-CA'],
    riskAreas: ['Management structure', 'Profit/loss allocation', 'Transfer restrictions', 'Dissolution'],
    seoKeywords: ['LLC operating agreement', 'limited liability company', 'business formation'],
    fields: [
      {
        id: 'llc_name',
        name: 'llc_name',
        label: 'LLC Name',
        type: 'text',
        required: true
      },
      {
        id: 'members',
        name: 'members',
        label: 'Members Information',
        type: 'textarea',
        required: true,
        placeholder: 'List each member with name and ownership percentage'
      },
      {
        id: 'management_type',
        name: 'management_type',
        label: 'Management Type',
        type: 'radio',
        required: true,
        options: [
          { value: 'member_managed', label: 'Member-Managed' },
          { value: 'manager_managed', label: 'Manager-Managed' }
        ]
      },
      {
        id: 'business_purpose',
        name: 'business_purpose',
        label: 'Business Purpose',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the LLC\'s business purpose and activities'
      }
    ],
    clauses: []
  },
  {
    id: 'privacy_policy',
    name: 'Privacy Policy',
    description: 'Data privacy policy for websites and applications',
    category: 'legal',
    complexity: 'medium',
    estimatedPages: 6,
    jurisdictions: ['US-DE', 'US-CA', 'EU', 'UK', 'CA'],
    riskAreas: ['Data collection practices', 'GDPR compliance', 'Cookie usage', 'Third-party integrations'],
    seoKeywords: ['privacy policy', 'data protection', 'GDPR compliance', 'website privacy'],
    fields: [
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true
      },
      {
        id: 'website_url',
        name: 'website_url',
        label: 'Website URL',
        type: 'text',
        required: true,
        placeholder: 'https://example.com'
      },
      {
        id: 'data_types',
        name: 'data_types',
        label: 'Types of Data Collected',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'personal_info', label: 'Personal Information (name, email)' },
          { value: 'usage_data', label: 'Usage Data (analytics)' },
          { value: 'cookies', label: 'Cookies and Tracking' },
          { value: 'payment_info', label: 'Payment Information' },
          { value: 'location_data', label: 'Location Data' }
        ]
      },
      {
        id: 'contact_email',
        name: 'contact_email',
        label: 'Contact Email for Privacy Inquiries',
        type: 'text',
        required: true,
        placeholder: 'privacy@company.com'
      }
    ],
    clauses: []
  },
  {
    id: 'terms_of_service',
    name: 'Terms and Conditions',
    description: 'Terms and conditions for website or application use',
    category: 'legal',
    complexity: 'medium',
    estimatedPages: 8,
    jurisdictions: ['US-DE', 'US-CA', 'EU', 'UK', 'CA'],
    riskAreas: ['User obligations', 'Liability limitations', 'Dispute resolution', 'Termination rights'],
    seoKeywords: ['terms of service', 'terms and conditions', 'user agreement', 'website terms'],
    fields: [
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true
      },
      {
        id: 'service_name',
        name: 'service_name',
        label: 'Service/Product Name',
        type: 'text',
        required: true
      },
      {
        id: 'website_url',
        name: 'website_url',
        label: 'Website URL',
        type: 'text',
        required: true
      },
      {
        id: 'service_type',
        name: 'service_type',
        label: 'Service Type',
        type: 'select',
        required: true,
        options: [
          { value: 'saas', label: 'Software as a Service (SaaS)' },
          { value: 'ecommerce', label: 'E-commerce Platform' },
          { value: 'marketplace', label: 'Marketplace' },
          { value: 'content', label: 'Content Platform' },
          { value: 'mobile_app', label: 'Mobile Application' }
        ]
      }
    ],
    clauses: []
  },
  {
    id: 'vendor_agreement',
    name: 'Vendor Agreement',
    description: 'Agreement with suppliers and service providers',
    category: 'business',
    complexity: 'medium',
    estimatedPages: 7,
    jurisdictions: ['US-DE', 'US-CA', 'UK', 'EU', 'CA'],
    riskAreas: ['Service levels', 'Payment terms', 'Quality standards', 'Termination clauses'],
    seoKeywords: ['vendor agreement', 'supplier contract', 'procurement agreement'],
    fields: [
      {
        id: 'vendor_name',
        name: 'vendor_name',
        label: 'Vendor Name',
        type: 'text',
        required: true
      },
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true
      },
      {
        id: 'products_services',
        name: 'products_services',
        label: 'Products/Services Description',
        type: 'textarea',
        required: true
      },
      {
        id: 'payment_terms',
        name: 'payment_terms',
        label: 'Payment Terms',
        type: 'select',
        required: true,
        options: [
          { value: 'net_30', label: 'Net 30 days' },
          { value: 'net_60', label: 'Net 60 days' },
          { value: 'upon_delivery', label: 'Upon delivery' },
          { value: 'monthly', label: 'Monthly billing' }
        ]
      }
    ],
    clauses: []
  },
  {
    id: 'partnership_agreement',
    name: 'Partnership Agreement',
    description: 'Agreement between business partners defining roles and responsibilities',
    category: 'business',
    complexity: 'complex',
    estimatedPages: 10,
    jurisdictions: ['US-DE', 'US-CA', 'UK', 'CA'],
    riskAreas: ['Profit sharing', 'Decision making authority', 'Partner withdrawal', 'Dispute resolution'],
    seoKeywords: ['partnership agreement', 'business partnership', 'joint venture'],
    fields: [
      {
        id: 'partnership_name',
        name: 'partnership_name',
        label: 'Partnership Name',
        type: 'text',
        required: true
      },
      {
        id: 'partners',
        name: 'partners',
        label: 'Partners Information',
        type: 'textarea',
        required: true,
        placeholder: 'List each partner with name, contribution, and ownership percentage'
      },
      {
        id: 'business_purpose',
        name: 'business_purpose',
        label: 'Business Purpose',
        type: 'textarea',
        required: true
      },
      {
        id: 'profit_sharing',
        name: 'profit_sharing',
        label: 'Profit Sharing Method',
        type: 'select',
        required: true,
        options: [
          { value: 'equal', label: 'Equal shares' },
          { value: 'proportional', label: 'Proportional to investment' },
          { value: 'custom', label: 'Custom arrangement' }
        ]
      }
    ],
    clauses: []
  },
  {
    id: 'license_agreement',
    name: 'Software License Agreement',
    description: 'License agreement for software products',
    category: 'intellectual-property',
    complexity: 'medium',
    estimatedPages: 6,
    jurisdictions: ['US-DE', 'US-CA', 'EU', 'UK'],
    riskAreas: ['License scope', 'Usage restrictions', 'Support obligations', 'Termination rights'],
    seoKeywords: ['software license', 'license agreement', 'software contract'],
    fields: [
      {
        id: 'licensor_name',
        name: 'licensor_name',
        label: 'Licensor Name (Software Owner)',
        type: 'text',
        required: true
      },
      {
        id: 'licensee_name',
        name: 'licensee_name',
        label: 'Licensee Name (Software User)',
        type: 'text',
        required: true
      },
      {
        id: 'software_name',
        name: 'software_name',
        label: 'Software Name',
        type: 'text',
        required: true
      },
      {
        id: 'license_type',
        name: 'license_type',
        label: 'License Type',
        type: 'select',
        required: true,
        options: [
          { value: 'perpetual', label: 'Perpetual License' },
          { value: 'subscription', label: 'Subscription License' },
          { value: 'trial', label: 'Trial License' }
        ]
      },
      {
        id: 'license_fee',
        name: 'license_fee',
        label: 'License Fee ($)',
        type: 'number',
        required: true
      }
    ],
    clauses: []
  },
  {
    id: 'distribution_agreement',
    name: 'Distribution Agreement',
    description: 'Agreement for product distribution and sales',
    category: 'business',
    complexity: 'complex',
    estimatedPages: 12,
    jurisdictions: ['US-DE', 'US-CA', 'EU', 'UK'],
    riskAreas: ['Territory restrictions', 'Sales targets', 'Pricing terms', 'Exclusivity rights'],
    seoKeywords: ['distribution agreement', 'distributor contract', 'sales agreement'],
    fields: [
      {
        id: 'supplier_name',
        name: 'supplier_name',
        label: 'Supplier Name',
        type: 'text',
        required: true
      },
      {
        id: 'distributor_name',
        name: 'distributor_name',
        label: 'Distributor Name',
        type: 'text',
        required: true
      },
      {
        id: 'products',
        name: 'products',
        label: 'Products Description',
        type: 'textarea',
        required: true
      },
      {
        id: 'territory',
        name: 'territory',
        label: 'Distribution Territory',
        type: 'text',
        required: true,
        placeholder: 'Geographic area for distribution rights'
      },
      {
        id: 'exclusivity',
        name: 'exclusivity',
        label: 'Exclusivity',
        type: 'radio',
        required: true,
        options: [
          { value: 'exclusive', label: 'Exclusive distribution rights' },
          { value: 'non_exclusive', label: 'Non-exclusive distribution rights' }
        ]
      }
    ],
    clauses: []
  },
  {
    id: 'loan_agreement',
    name: 'Loan Agreement',
    description: 'Agreement for business or personal loans',
    category: 'legal',
    complexity: 'medium',
    estimatedPages: 5,
    jurisdictions: ['US-DE', 'US-CA', 'UK', 'CA'],
    riskAreas: ['Interest rates', 'Repayment terms', 'Default provisions', 'Security/collateral'],
    seoKeywords: ['loan agreement', 'promissory note', 'business loan', 'lending contract'],
    fields: [
      {
        id: 'lender_name',
        name: 'lender_name',
        label: 'Lender Name',
        type: 'text',
        required: true
      },
      {
        id: 'borrower_name',
        name: 'borrower_name',
        label: 'Borrower Name',
        type: 'text',
        required: true
      },
      {
        id: 'loan_amount',
        name: 'loan_amount',
        label: 'Loan Amount ($)',
        type: 'number',
        required: true
      },
      {
        id: 'interest_rate',
        name: 'interest_rate',
        label: 'Interest Rate (%)',
        type: 'number',
        required: true,
        validation: { min: 0, max: 50 }
      },
      {
        id: 'repayment_term',
        name: 'repayment_term',
        label: 'Repayment Term',
        type: 'select',
        required: true,
        options: [
          { value: '6_months', label: '6 months' },
          { value: '1_year', label: '1 year' },
          { value: '2_years', label: '2 years' },
          { value: '3_years', label: '3 years' },
          { value: '5_years', label: '5 years' }
        ]
      }
    ],
    clauses: []
  },
  {
    id: 'lease_agreement',
    name: 'Commercial Lease Agreement',
    description: 'Lease agreement for commercial real estate',
    category: 'legal',
    complexity: 'complex',
    estimatedPages: 15,
    jurisdictions: ['US-DE', 'US-CA', 'UK', 'CA'],
    riskAreas: ['Rent escalation', 'Maintenance responsibilities', 'Assignment rights', 'Termination clauses'],
    seoKeywords: ['commercial lease', 'office lease', 'retail lease', 'property rental'],
    fields: [
      {
        id: 'landlord_name',
        name: 'landlord_name',
        label: 'Landlord Name',
        type: 'text',
        required: true
      },
      {
        id: 'tenant_name',
        name: 'tenant_name',
        label: 'Tenant Name',
        type: 'text',
        required: true
      },
      {
        id: 'property_address',
        name: 'property_address',
        label: 'Property Address',
        type: 'textarea',
        required: true
      },
      {
        id: 'lease_term',
        name: 'lease_term',
        label: 'Lease Term (years)',
        type: 'select',
        required: true,
        options: [
          { value: '1', label: '1 year' },
          { value: '3', label: '3 years' },
          { value: '5', label: '5 years' },
          { value: '10', label: '10 years' }
        ]
      },
      {
        id: 'monthly_rent',
        name: 'monthly_rent',
        label: 'Monthly Rent ($)',
        type: 'number',
        required: true
      }
    ],
    clauses: []
  },
  {
    id: 'terms_conditions',
    name: 'Terms and Conditions',
    description: 'Comprehensive terms of service for websites and applications with country-specific legal context',
    category: 'legal',
    complexity: 'medium',
    estimatedPages: 8,
    jurisdictions: ['US', 'US-DE', 'US-CA', 'EU', 'UK', 'CA', 'BR', 'PT', 'MX', 'ES', 'DE', 'FR', 'IN', 'JP', 'RU', 'CN', 'AE'],
    riskAreas: ['User obligations', 'Liability limitations', 'Dispute resolution', 'Termination rights', 'Jurisdiction-specific compliance'],
    seoKeywords: ['terms and conditions', 'terms of service', 'user agreement', 'website terms', 'app terms'],
    fields: [
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true
      },
      {
        id: 'service_name',
        name: 'service_name',
        label: 'Service/Product Name',
        type: 'text',
        required: true
      },
      {
        id: 'website_url',
        name: 'website_url',
        label: 'Website URL',
        type: 'text',
        required: true
      },
      {
        id: 'jurisdiction',
        name: 'jurisdiction',
        label: 'Primary Jurisdiction',
        type: 'select',
        required: true,
        options: [
          { value: 'US', label: 'United States' },
          { value: 'BR', label: 'Brazil' },
          { value: 'PT', label: 'Portugal' },
          { value: 'MX', label: 'Mexico' },
          { value: 'CA', label: 'Canada' },
          { value: 'UK', label: 'United Kingdom' },
          { value: 'ES', label: 'Spain' },
          { value: 'DE', label: 'Germany' },
          { value: 'FR', label: 'France' },
          { value: 'IN', label: 'India' }
        ]
      },
      {
        id: 'service_type',
        name: 'service_type',
        label: 'Service Type',
        type: 'select',
        required: true,
        options: [
          { value: 'saas', label: 'Software as a Service (SaaS)' },
          { value: 'ecommerce', label: 'E-commerce Platform' },
          { value: 'marketplace', label: 'Marketplace' },
          { value: 'content', label: 'Content Platform' },
          { value: 'mobile_app', label: 'Mobile Application' },
          { value: 'ai_service', label: 'AI/ML Service' }
        ]
      }
    ],
    clauses: []
  },
  {
    id: 'privacy_notice',
    name: 'Privacy Notice',
    description: 'GDPR, LGPD, and multi-jurisdiction compliant privacy policy with country-specific data protection requirements',
    category: 'legal',
    complexity: 'medium',
    estimatedPages: 10,
    jurisdictions: ['US', 'US-DE', 'US-CA', 'EU', 'UK', 'CA', 'BR', 'PT', 'MX', 'ES', 'DE', 'FR', 'IN', 'JP', 'RU', 'CN', 'AE'],
    riskAreas: ['Data collection practices', 'GDPR/LGPD compliance', 'Cookie usage', 'Cross-border data transfers', 'User rights'],
    seoKeywords: ['privacy policy', 'privacy notice', 'data protection', 'GDPR compliance', 'LGPD compliance', 'data privacy'],
    fields: [
      {
        id: 'company_name',
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true
      },
      {
        id: 'website_url',
        name: 'website_url',
        label: 'Website URL',
        type: 'text',
        required: true,
        placeholder: 'https://example.com'
      },
      {
        id: 'primary_jurisdiction',
        name: 'primary_jurisdiction',
        label: 'Primary Operating Jurisdiction',
        type: 'select',
        required: true,
        options: [
          { value: 'US', label: 'United States' },
          { value: 'BR', label: 'Brazil (LGPD)' },
          { value: 'PT', label: 'Portugal (GDPR)' },
          { value: 'MX', label: 'Mexico' },
          { value: 'CA', label: 'Canada (PIPEDA)' },
          { value: 'UK', label: 'United Kingdom (UK GDPR)' },
          { value: 'ES', label: 'Spain (GDPR)' },
          { value: 'DE', label: 'Germany (GDPR)' },
          { value: 'FR', label: 'France (GDPR)' },
          { value: 'IN', label: 'India (DPDP Act)' }
        ]
      },
      {
        id: 'data_types',
        name: 'data_types',
        label: 'Types of Data Collected',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'personal_info', label: 'Personal Information (name, email)' },
          { value: 'usage_data', label: 'Usage Data (analytics)' },
          { value: 'cookies', label: 'Cookies and Tracking' },
          { value: 'payment_info', label: 'Payment Information' },
          { value: 'location_data', label: 'Location Data' },
          { value: 'biometric_data', label: 'Biometric Data' },
          { value: 'sensitive_data', label: 'Sensitive Personal Data' }
        ]
      },
      {
        id: 'contact_email',
        name: 'contact_email',
        label: 'Data Protection Officer/Privacy Contact Email',
        type: 'text',
        required: true,
        placeholder: 'privacy@company.com'
      },
      {
        id: 'data_retention',
        name: 'data_retention',
        label: 'Data Retention Period',
        type: 'select',
        required: true,
        options: [
          { value: '1_year', label: '1 year' },
          { value: '2_years', label: '2 years' },
          { value: '3_years', label: '3 years' },
          { value: '5_years', label: '5 years' },
          { value: 'as_required', label: 'As required by law' }
        ]
      }
    ],
    clauses: []
  }
]