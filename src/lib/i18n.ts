export interface Language {
  code: string
  name: string
  flag: string
  nativeName: string
}

export const SUPPORTED_UI_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese (Portugal)', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'pt-br', name: 'Portuguese (Brazil)', flag: '🇧🇷', nativeName: 'Português (Brasil)' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' }
]

export const translations = {
  en: {
    // Header
    dashboard: 'Dashboard',
    analyzer: 'Analyzer',
    pricing: 'Pricing',
    signIn: 'Sign In',
    profile: 'Profile',
    billing: 'Billing',
    settings: 'Settings',
    logOut: 'Log out',
    
    // Hero Section
    heroTitle: 'Analyze Legal Contracts with AI',
    heroSubtitle: 'Get instant risk assessments, multilingual translations, and expert recommendations for your legal contracts. Built specifically for startups and growing businesses.',
    bankLevelSecurity: 'Bank-level Security',
    tenLanguages: '10 Languages',
    instantAnalysis: 'Instant Analysis',
    
    // Upload Section
    startAnalysis: 'Start Your Analysis',
    uploadDescription: 'Upload your contract or paste the text to get started',
    contractLanguage: 'Contract Language:',
    uploadFile: 'Upload File',
    pasteText: 'Paste Text',
    uploadContract: 'Upload your contract',
    dragDropText: 'Drag and drop your contract file here, or click to browse',
    chooseFile: 'Choose File',
    supportedFormats: 'Supports: .txt, .md files',
    pasteContractText: 'Paste your contract text here...',
    analyzeContract: 'Analyze Contract',
    analyzing: 'Analyzing...',
    analyzingContract: 'Analyzing contract...',
    analyzingDescription: 'This may take a few moments',
    
    // Features
    featuresTitle: 'Powerful Features for Legal Analysis',
    featuresSubtitle: 'Everything you need to understand, translate, and compare legal contracts with confidence',
    riskAssessment: 'Risk Assessment',
    riskAssessmentDesc: 'AI-powered analysis identifies potential risks and provides actionable recommendations based on legal context and jurisdiction.',
    multilingualTranslation: 'Multilingual Translation',
    multilingualDesc: 'Translate contracts across 10 languages including English, Mandarin, Spanish, Arabic, and more with legal context preservation.',
    
    // Pricing - Updated Structure
    pricingTitle: 'Simple, Transparent Pricing',
    pricingSubtitle: 'All prices are in US Dollars (USD). Choose the plan that works best for your business',
    
    // Basic Plan
    basicPlan: 'Basic Plan',
    basicPlanDesc: 'Unlimited access to contract analyzer',
    unlimitedAnalysis: 'Unlimited contract analysis',
    noContractGeneration: 'Does not include contract generation',
    contractGenerationCost: 'Cost per contract generation: $0.80 USD per page',
    cancelAnytime: 'Cancellation available anytime',
    
    // AI+ Plan
    aiPlusTitle: 'AI+ Plan',
    aiPlusDesc: 'Advanced features for power users',
    pdfWordExport: 'PDF and Word document export with track changes',
    fiveContractsIncluded: '5 contracts generated per month at no additional cost',
    additionalContracts: 'Additional contracts: $0.60 USD per page',
    flexibleCancellation: 'Flexible cancellation',
    
    // Team Plan
    teamTitle: 'Team Plan',
    teamDesc: 'Collaboration tools for teams',
    tenContractsIncluded: '10 contracts generated per month at no additional cost',
    additionalContractsTeam: 'Additional contracts: $0.50 USD per page',
    multiUserCollaboration: 'Multi-user collaboration enabled (email or link invitations)',
    
    // Unlimited Plan
    unlimitedPlan: 'Unlimited Plan',
    unlimitedPlanDesc: 'Unlimited contract generation',
    unlimitedGeneration: 'Unlimited contract generation',
    fullCollaborativeAccess: 'Full access to collaborative features',
    
    // New Contract Types
    termsAndConditions: 'Terms and Conditions',
    privacyNotice: 'Privacy Notice',
    legalContextSupport: 'With contextual legal support based on applicable legislation for each country',
    
    // Common features
    perMonth: 'per month',
    perDocument: 'per document',
    mostPopular: 'Most Popular',
    fullAIAnalysis: 'Full AI analysis',
    riskAssessmentFeature: 'Risk assessment',
    translationFeature: 'Translation to any language',
    noCommitment: 'No monthly commitment',
    documentHistory: 'Document history & management',
    prioritySupport: 'Priority support',
    viewFullPricing: 'View Full Pricing',
    
    // Legacy pricing terms
    payPerDocument: 'Pay Per Document',
    payPerDocumentDesc: 'Perfect for occasional use',
    monthlySubscription: 'Monthly Subscription',
    monthlySubscriptionDesc: 'Best value for regular users',
    
    // Social Proof
    trustedBy: 'Trusted by 500+ startups and legal professionals',
    users: 'Users',
    soc2Compliant: 'SOC2 Compliant',
    languages: 'Languages',
    
    // Advanced features
    advancedRedlining: 'Advanced redlining',
    clauseEditing: 'Clause editing',
    countrySpecificReports: 'Country-specific risk reports',
    multiUserDashboard: 'Multi-user dashboard',
    savedAnalysis: 'Saved analysis',
    docxExport: 'Export to .docx',
    
    // Payment Methods
    paymentMethods: 'Payment Methods',
    creditCard: 'Credit Card',
    paypal: 'PayPal',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    crypto: 'Cryptocurrency',
    
    // Legal Systems
    legalSystem: 'Legal System',
    usLaw: 'US Law',
    euLaw: 'EU Law',
    ukLaw: 'UK Law',
    commonLaw: 'Common Law',
    civilLaw: 'Civil Law',
    mixedLaw: 'Mixed Legal System',
    
    // Jurisdictions - Updated with new countries
    jurisdictionUS: 'United States',
    jurisdictionMX: 'Mexico',
    jurisdictionJP: 'Japan',
    jurisdictionRU: 'Russia',
    jurisdictionCN: 'China',
    jurisdictionAE: 'United Arab Emirates',
    jurisdictionIN: 'India',
    jurisdictionBR: 'Brazil',
    jurisdictionPT: 'Portugal',
    jurisdictionCA: 'Canada',
    jurisdictionUK: 'United Kingdom',
    jurisdictionES: 'Spain',
    jurisdictionDE: 'Germany',
    jurisdictionFR: 'France',
    jurisdictionEU: 'Europe',
    jurisdictionIT: 'Italy'
  },
  es: {
    // Header
    dashboard: 'Panel',
    analyzer: 'Analizador',
    pricing: 'Precios',
    signIn: 'Iniciar Sesión',
    profile: 'Perfil',
    billing: 'Facturación',
    settings: 'Configuración',
    logOut: 'Cerrar Sesión',
    
    // Hero Section
    heroTitle: 'Analiza Contratos Legales con IA',
    heroSubtitle: 'Obtén evaluaciones de riesgo instantáneas, traducciones multilingües y recomendaciones expertas para tus contratos legales. Diseñado específicamente para startups y empresas en crecimiento.',
    bankLevelSecurity: 'Seguridad Bancaria',
    tenLanguages: '10 Idiomas',
    instantAnalysis: 'Análisis Instantáneo',
    
    // Upload Section
    startAnalysis: 'Comienza tu Análisis',
    uploadDescription: 'Sube tu contrato o pega el texto para comenzar',
    contractLanguage: 'Idioma del Contrato:',
    uploadFile: 'Subir Archivo',
    pasteText: 'Pegar Texto',
    uploadContract: 'Sube tu contrato',
    dragDropText: 'Arrastra y suelta tu archivo de contrato aquí, o haz clic para navegar',
    chooseFile: 'Elegir Archivo',
    supportedFormats: 'Soporta: archivos .txt, .md',
    pasteContractText: 'Pega el texto de tu contrato aquí...',
    analyzeContract: 'Analizar Contrato',
    analyzing: 'Analizando...',
    analyzingContract: 'Analizando contrato...',
    analyzingDescription: 'Esto puede tomar unos momentos',
    
    // Features
    featuresTitle: 'Características Poderosas para Análisis Legal',
    featuresSubtitle: 'Todo lo que necesitas para entender, traducir y comparar contratos legales con confianza',
    riskAssessment: 'Evaluación de Riesgos',
    riskAssessmentDesc: 'El análisis impulsado por IA identifica riesgos potenciales y proporciona recomendaciones accionables basadas en el contexto legal y la jurisdicción.',
    multilingualTranslation: 'Traducción Multilingüe',
    multilingualDesc: 'Traduce contratos en 10 idiomas incluyendo inglés, mandarín, español, árabe y más con preservación del contexto legal.',
    
    // Pricing - Updated Structure
    pricingTitle: 'Precios Simples y Transparentes',
    pricingSubtitle: 'Todos los precios están expresados en dólares estadounidenses (USD). Elige el plan que mejor funcione para tu negocio',
    
    // Basic Plan
    basicPlan: 'Plan Básico',
    basicPlanDesc: 'Acceso ilimitado al analizador de contratos',
    unlimitedAnalysis: 'Análisis ilimitado de contratos',
    noContractGeneration: 'No incluye generación de contratos',
    contractGenerationCost: 'Costo por generación de contrato: $0.80 USD por hoja',
    cancelAnytime: 'Cancelación disponible en cualquier momento',
    
    // AI+ Plan
    aiPlusTitle: 'Plan AI+',
    aiPlusDesc: 'Características avanzadas para usuarios avanzados',
    pdfWordExport: 'Exportación de documentos en PDF y Word, con control de cambios',
    fiveContractsIncluded: '5 contratos generados por mes sin costo adicional',
    additionalContracts: 'Contratos adicionales: $0.60 USD por hoja',
    flexibleCancellation: 'Cancelación flexible',
    
    // Team Plan
    teamTitle: 'Plan Equipo',
    teamDesc: 'Herramientas de colaboración para equipos',
    tenContractsIncluded: '10 contratos generados por mes sin costo adicional',
    additionalContractsTeam: 'Contratos adicionales: $0.50 USD por hoja',
    multiUserCollaboration: 'Colaboración multiusuario habilitada (invitaciones por correo o enlace)',
    
    // Unlimited Plan
    unlimitedPlan: 'Plan Ilimitado',
    unlimitedPlanDesc: 'Generación ilimitada de contratos',
    unlimitedGeneration: 'Generación ilimitada de contratos',
    fullCollaborativeAccess: 'Acceso total a funcionalidades colaborativas',
    
    // New Contract Types
    termsAndConditions: 'Términos y Condiciones',
    privacyNotice: 'Aviso de Privacidad',
    legalContextSupport: 'Con soporte jurídico contextual basado en la legislación aplicable de cada país',
    
    // Common features
    perMonth: 'por mes',
    perDocument: 'por documento',
    mostPopular: 'Más Popular',
    fullAIAnalysis: 'Análisis completo de IA',
    riskAssessmentFeature: 'Evaluación de riesgos',
    translationFeature: 'Traducción a cualquier idioma',
    noCommitment: 'Sin compromiso mensual',
    documentHistory: 'Historial y gestión de documentos',
    prioritySupport: 'Soporte prioritario',
    viewFullPricing: 'Ver Precios Completos',
    
    // Legacy pricing terms
    payPerDocument: 'Pago por Documento',
    payPerDocumentDesc: 'Perfecto para uso ocasional',
    monthlySubscription: 'Suscripción Mensual',
    monthlySubscriptionDesc: 'Mejor valor para usuarios regulares',
    
    // Social Proof
    trustedBy: 'Confiado por más de 500 startups y profesionales legales',
    users: 'Usuarios',
    soc2Compliant: 'Cumple SOC2',
    languages: 'Idiomas',
    
    // Advanced features
    advancedRedlining: 'Redlineado avanzado',
    clauseEditing: 'Edición de cláusulas',
    countrySpecificReports: 'Reportes de riesgo específicos por país',
    multiUserDashboard: 'Panel multi-usuario',
    savedAnalysis: 'Análisis guardados',
    docxExport: 'Exportar a .docx',
    
    // Payment Methods
    paymentMethods: 'Métodos de Pago',
    creditCard: 'Tarjeta de Crédito',
    paypal: 'PayPal',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    crypto: 'Criptomoneda',
    
    // Legal Systems
    legalSystem: 'Sistema Legal',
    usLaw: 'Ley de EE.UU.',
    euLaw: 'Ley de la UE',
    ukLaw: 'Ley del Reino Unido',
    commonLaw: 'Derecho Común',
    civilLaw: 'Derecho Civil',
    mixedLaw: 'Sistema Legal Mixto',
    
    // Jurisdictions - Updated with new countries
    jurisdictionUS: 'Estados Unidos',
    jurisdictionMX: 'México',
    jurisdictionJP: 'Japón',
    jurisdictionRU: 'Rusia',
    jurisdictionCN: 'China',
    jurisdictionAE: 'Emiratos Árabes Unidos',
    jurisdictionIN: 'India',
    jurisdictionBR: 'Brasil',
    jurisdictionPT: 'Portugal',
    jurisdictionCA: 'Canadá',
    jurisdictionUK: 'Reino Unido',
    jurisdictionES: 'España',
    jurisdictionDE: 'Alemania',
    jurisdictionFR: 'Francia'
  },
  'pt-br': {
    // Header
    dashboard: 'Painel',
    analyzer: 'Analisador',
    pricing: 'Preços',
    signIn: 'Entrar',
    profile: 'Perfil',
    billing: 'Faturamento',
    settings: 'Configurações',
    logOut: 'Sair',
    
    // Hero Section
    heroTitle: 'Analise Contratos Legais com IA',
    heroSubtitle: 'Obtenha avaliações de risco instantâneas, traduções multilíngues e recomendações especializadas para seus contratos legais. Desenvolvido especificamente para startups e empresas em crescimento.',
    bankLevelSecurity: 'Segurança Bancária',
    tenLanguages: '10 Idiomas',
    instantAnalysis: 'Análise Instantânea',
    
    // Upload Section
    startAnalysis: 'Comece sua Análise',
    uploadDescription: 'Carregue seu contrato ou cole o texto para começar',
    contractLanguage: 'Idioma do Contrato:',
    uploadFile: 'Carregar Arquivo',
    pasteText: 'Colar Texto',
    uploadContract: 'Carregue seu contrato',
    dragDropText: 'Arraste e solte seu arquivo de contrato aqui, ou clique para navegar',
    chooseFile: 'Escolher Arquivo',
    supportedFormats: 'Suporta: arquivos .txt, .md',
    pasteContractText: 'Cole o texto do seu contrato aqui...',
    analyzeContract: 'Analisar Contrato',
    analyzing: 'Analisando...',
    analyzingContract: 'Analisando contrato...',
    analyzingDescription: 'Isso pode levar alguns momentos',
    
    // Features
    featuresTitle: 'Recursos Poderosos para Análise Legal',
    featuresSubtitle: 'Tudo que você precisa para entender, traduzir e comparar contratos legais com confiança',
    riskAssessment: 'Avaliação de Riscos',
    riskAssessmentDesc: 'Análise alimentada por IA identifica riscos potenciais e fornece recomendações acionáveis baseadas no contexto legal e jurisdição.',
    multilingualTranslation: 'Tradução Multilíngue',
    multilingualDesc: 'Traduza contratos em 10 idiomas incluindo inglês, mandarim, espanhol, árabe e mais com preservação do contexto legal.',
    
    // Pricing - New Structure
    pricingTitle: 'Preços Simples e Transparentes',
    pricingSubtitle: 'Todos os preços estão expressos em dólares americanos (USD). Escolha o plano que melhor funciona para seu negócio',
    
    // Basic Plan
    basicPlan: 'Plano Básico',
    basicPlanDesc: 'Acesso ilimitado ao analisador de contratos',
    unlimitedAnalysis: 'Análise ilimitada de contratos',
    noContractGeneration: 'Não inclui geração de contratos',
    contractGenerationCost: 'Custo por geração de contrato: $0.80 USD por página',
    cancelAnytime: 'Cancelamento disponível a qualquer momento',
    
    // AI+ Plan
    aiPlusTitle: 'Plano AI+',
    aiPlusDesc: 'Recursos avançados para usuários avançados',
    pdfWordExport: 'Exportação de documentos em PDF e Word, com controle de alterações',
    fiveContractsIncluded: '5 contratos gerados por mês sem custo adicional',
    additionalContracts: 'Contratos adicionais: $0.60 USD por página',
    flexibleCancellation: 'Cancelamento flexível',
    
    // Team Plan
    teamTitle: 'Plano Equipe',
    teamDesc: 'Ferramentas de colaboração para equipes',
    tenContractsIncluded: '10 contratos gerados por mês sem custo adicional',
    additionalContractsTeam: 'Contratos adicionais: $0.50 USD por página',
    multiUserCollaboration: 'Colaboração multiusuário habilitada (convites por email ou link)',
    
    // Unlimited Plan
    unlimitedPlan: 'Plano Ilimitado',
    unlimitedPlanDesc: 'Geração ilimitada de contratos',
    unlimitedGeneration: 'Geração ilimitada de contratos',
    fullCollaborativeAccess: 'Acesso total a funcionalidades colaborativas',
    
    // New Contract Types
    termsAndConditions: 'Termos e Condições',
    privacyNotice: 'Aviso de Privacidade',
    legalContextSupport: 'Com suporte jurídico contextual baseado na legislação aplicável de cada país',
    
    // Common features
    perMonth: 'por mês',
    perDocument: 'por documento',
    mostPopular: 'Mais Popular',
    fullAIAnalysis: 'Análise completa de IA',
    riskAssessmentFeature: 'Avaliação de riscos',
    translationFeature: 'Tradução para qualquer idioma',
    noCommitment: 'Sem compromisso mensal',
    documentHistory: 'Histórico e gestão de documentos',
    prioritySupport: 'Suporte prioritário',
    viewFullPricing: 'Ver Preços Completos',
    
    // Legacy pricing terms
    payPerDocument: 'Pagar por Documento',
    payPerDocumentDesc: 'Perfeito para uso ocasional',
    monthlySubscription: 'Assinatura Mensal',
    monthlySubscriptionDesc: 'Melhor valor para usuários regulares',
    
    // Social Proof
    trustedBy: 'Confiado por mais de 500 startups e profissionais legais',
    users: 'Usuários',
    soc2Compliant: 'Compatível com SOC2',
    languages: 'Idiomas',
    
    // Advanced features
    advancedRedlining: 'Redlineamento avançado',
    clauseEditing: 'Edição de cláusulas',
    countrySpecificReports: 'Relatórios de risco específicos por país',
    multiUserDashboard: 'Painel multi-usuário',
    savedAnalysis: 'Análises salvas',
    docxExport: 'Exportar para .docx',
    
    // Payment Methods
    paymentMethods: 'Métodos de Pagamento',
    creditCard: 'Cartão de Crédito',
    paypal: 'PayPay',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    crypto: 'Criptomoeda',
    
    // Legal Systems
    legalSystem: 'Sistema Legal',
    usLaw: 'Lei dos EUA',
    euLaw: 'Lei da UE',
    ukLaw: 'Lei do Reino Unido',
    commonLaw: 'Direito Comum',
    civilLaw: 'Direito Civil',
    mixedLaw: 'Sistema Legal Misto',
    
    // Jurisdictions - Updated with new countries
    jurisdictionUS: 'Estados Unidos',
    jurisdictionMX: 'México',
    jurisdictionJP: 'Japão',
    jurisdictionRU: 'Rússia',
    jurisdictionCN: 'China',
    jurisdictionAE: 'Emirados Árabes Unidos',
    jurisdictionIN: 'Índia',
    jurisdictionBR: 'Brasil',
    jurisdictionPT: 'Portugal',
    jurisdictionCA: 'Canadá',
    jurisdictionUK: 'Reino Unido',
    jurisdictionES: 'Espanha',
    jurisdictionDE: 'Alemanha',
    jurisdictionFR: 'França'
  },
  zh: {
    // Header
    dashboard: '仪表板',
    analyzer: '分析器',
    pricing: '定价',
    signIn: '登录',
    profile: '个人资料',
    billing: '账单',
    settings: '设置',
    logOut: '退出',
    
    // Hero Section
    heroTitle: '用AI分析法律合同',
    heroSubtitle: '为您的法律合同获得即时风险评估、多语言翻译和专家建议。专为初创公司和成长型企业而设计。',
    bankLevelSecurity: '银行级安全',
    tenLanguages: '10种语言',
    instantAnalysis: '即时分析',
    
    // Upload Section
    startAnalysis: '开始分析',
    uploadDescription: '上传您的合同或粘贴文本开始',
    contractLanguage: '合同语言：',
    uploadFile: '上传文件',
    pasteText: '粘贴文本',
    uploadContract: '上传您的合同',
    dragDropText: '将合同文件拖放到此处，或点击浏览',
    chooseFile: '选择文件',
    supportedFormats: '支持：.txt、.md文件',
    pasteContractText: '在此粘贴您的合同文本...',
    analyzeContract: '分析合同',
    analyzing: '分析中...',
    analyzingContract: '正在分析合同...',
    analyzingDescription: '这可能需要几分钟',
    
    // Features
    featuresTitle: '强大的法律分析功能',
    featuresSubtitle: '您需要的一切来理解、翻译和比较法律合同',
    riskAssessment: '风险评估',
    riskAssessmentDesc: 'AI驱动的分析识别潜在风险，并基于法律背景和管辖权提供可行的建议。',
    multilingualTranslation: '多语言翻译',
    multilingualDesc: '在10种语言之间翻译合同，包括英语、中文、西班牙语、阿拉伯语等，保持法律语境。',
    
    // Pricing - Updated Structure
    pricingTitle: '简单透明的定价',
    pricingSubtitle: '所有价格均以美元(USD)计价。选择最适合您业务的计划',
    
    // Basic Plan
    basicPlan: '基础计划',
    basicPlanDesc: '无限制访问合同分析器',
    unlimitedAnalysis: '无限合同分析',
    noContractGeneration: '不包括合同生成',
    contractGenerationCost: '合同生成费用：每页$0.80美元',
    cancelAnytime: '随时可取消',
    
    // AI+ Plan
    aiPlusTitle: 'AI+计划',
    aiPlusDesc: '为高级用户提供的高级功能',
    pdfWordExport: 'PDF和Word文档导出，带修订跟踪',
    fiveContractsIncluded: '每月免费生成5份合同',
    additionalContracts: '额外合同：每页$0.60美元',
    flexibleCancellation: '灵活取消',
    
    // Team Plan
    teamTitle: '团队计划',
    teamDesc: '团队协作工具',
    tenContractsIncluded: '每月免费生成10份合同',
    additionalContractsTeam: '额外合同：每页$0.50美元',
    multiUserCollaboration: '启用多用户协作（邮件或链接邀请）',
    
    // Unlimited Plan
    unlimitedPlan: '无限计划',
    unlimitedPlanDesc: '无限合同生成',
    unlimitedGeneration: '无限合同生成',
    fullCollaborativeAccess: '完全访问协作功能',
    
    // New Contract Types
    termsAndConditions: '条款和条件',
    privacyNotice: '隐私声明',
    legalContextSupport: '基于各国适用法律的上下文法律支持',
    
    // Common features
    perMonth: '每月',
    perDocument: '每份文档',
    mostPopular: '最受欢迎',
    fullAIAnalysis: '完整AI分析',
    riskAssessmentFeature: '风险评估',
    translationFeature: '翻译成任何语言',
    noCommitment: '无月度承诺',
    documentHistory: '文档历史和管理',
    prioritySupport: '优先支持',
    viewFullPricing: '查看完整定价',
    
    // Legacy pricing terms
    payPerDocument: '按文档付费',
    payPerDocumentDesc: '适合偶尔使用',
    monthlySubscription: '月度订阅',
    monthlySubscriptionDesc: '常规用户的最佳价值',
    
    // Social Proof
    trustedBy: '受到500多家初创公司和法律专业人士的信赖',
    users: '用户',
    soc2Compliant: 'SOC2合规',
    languages: '语言',
    
    // Advanced features
    advancedRedlining: '高级红线标记',
    clauseEditing: '条款编辑',
    countrySpecificReports: '特定国家风险报告',
    multiUserDashboard: '多用户仪表板',
    savedAnalysis: '保存的分析',
    docxExport: '导出为.docx',
    
    // Payment Methods
    paymentMethods: '支付方式',
    creditCard: '信用卡',
    paypal: 'PayPal',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    crypto: '加密货币',
    
    // Legal Systems
    legalSystem: '法律体系',
    usLaw: '美国法',
    euLaw: '欧盟法',
    ukLaw: '英国法',
    commonLaw: '普通法',
    civilLaw: '民法',
    mixedLaw: '混合法律体系',
    
    // Jurisdictions - Updated with new countries
    jurisdictionUS: '美国',
    jurisdictionMX: '墨西哥',
    jurisdictionJP: '日本',
    jurisdictionRU: '俄罗斯',
    jurisdictionCN: '中国',
    jurisdictionAE: '阿拉伯联合酋长国',
    jurisdictionIN: '印度',
    jurisdictionBR: '巴西',
    jurisdictionPT: '葡萄牙',
    jurisdictionCA: '加拿大',
    jurisdictionUK: '英国',
    jurisdictionES: '西班牙',
    jurisdictionDE: '德国',
    jurisdictionFR: '法国'
  },
  fr: {
    // Header
    dashboard: 'Tableau de bord',
    analyzer: 'Analyseur',
    pricing: 'Tarifs',
    signIn: 'Se connecter',
    profile: 'Profil',
    billing: 'Facturation',
    settings: 'Paramètres',
    logOut: 'Se déconnecter',
    
    // Hero Section
    heroTitle: 'Analyser les contrats légaux avec l\'IA',
    heroSubtitle: 'Obtenez des évaluations de risque instantanées, des traductions multilingues et des recommandations d\'experts pour vos contrats légaux. Conçu spécifiquement pour les startups et les entreprises en croissance.',
    bankLevelSecurity: 'Sécurité bancaire',
    tenLanguages: '10 langues',
    instantAnalysis: 'Analyse instantanée',
    
    // Upload Section
    startAnalysis: 'Commencer votre analyse',
    uploadDescription: 'Téléchargez votre contrat ou collez le texte pour commencer',
    contractLanguage: 'Langue du contrat :',
    uploadFile: 'Télécharger un fichier',
    pasteText: 'Coller le texte',
    uploadContract: 'Téléchargez votre contrat',
    dragDropText: 'Glissez-déposez votre fichier de contrat ici, ou cliquez pour parcourir',
    chooseFile: 'Choisir un fichier',
    supportedFormats: 'Supporte : fichiers .txt, .md',
    pasteContractText: 'Collez le texte de votre contrat ici...',
    analyzeContract: 'Analyser le contrat',
    analyzing: 'Analyse en cours...',
    analyzingContract: 'Analyse du contrat en cours...',
    analyzingDescription: 'Cela peut prendre quelques instants',
    
    // Features
    featuresTitle: 'Fonctionnalités puissantes pour l\'analyse juridique',
    featuresSubtitle: 'Tout ce dont vous avez besoin pour comprendre, traduire et comparer les contrats légaux en toute confiance',
    riskAssessment: 'Évaluation des risques',
    riskAssessmentDesc: 'L\'analyse alimentée par l\'IA identifie les risques potentiels et fournit des recommandations exploitables basées sur le contexte juridique et la juridiction.',
    multilingualTranslation: 'Traduction multilingue',
    multilingualDesc: 'Traduisez les contrats dans 10 langues, y compris l\'anglais, le mandarin, l\'espagnol, l\'arabe et plus encore avec préservation du contexte juridique.',
    
    // Pricing
    pricingTitle: 'Tarifs simples et transparents',
    pricingSubtitle: 'Tous les prix sont en dollars américains (USD). Choisissez le plan qui convient le mieux à votre entreprise',
    basicPlan: 'Plan de base',
    basicPlanDesc: 'Accès illimité à l\'analyseur de contrats',
    unlimitedAnalysis: 'Analyse illimitée de contrats',
    noContractGeneration: 'N\'inclut pas la génération de contrats',
    contractGenerationCost: 'Coût par génération de contrat : 0,80 $ USD par page',
    cancelAnytime: 'Annulation disponible à tout moment',
    aiPlusTitle: 'Plan AI+',
    aiPlusDesc: 'Fonctionnalités avancées pour les utilisateurs expérimentés',
    pdfWordExport: 'Export PDF et Word avec suivi des modifications',
    fiveContractsIncluded: '5 contrats générés par mois sans coût supplémentaire',
    additionalContracts: 'Contrats supplémentaires : 0,60 $ USD par page',
    flexibleCancellation: 'Annulation flexible',
    teamTitle: 'Plan équipe',
    teamDesc: 'Outils de collaboration pour les équipes',
    tenContractsIncluded: '10 contrats générés par mois sans coût supplémentaire',
    additionalContractsTeam: 'Contrats supplémentaires : 0,50 $ USD par page',
    multiUserCollaboration: 'Collaboration multi-utilisateurs activée (invitations par e-mail ou lien)',
    unlimitedPlan: 'Plan illimité',
    unlimitedPlanDesc: 'Génération illimitée de contrats',
    unlimitedGeneration: 'Génération illimitée de contrats',
    fullCollaborativeAccess: 'Accès complet aux fonctionnalités collaboratives',
    termsAndConditions: 'Conditions générales',
    privacyNotice: 'Avis de confidentialité',
    legalContextSupport: 'Avec support juridique contextuel basé sur la législation applicable de chaque pays',
    perMonth: 'par mois',
    perDocument: 'par document',
    mostPopular: 'Le plus populaire',
    fullAIAnalysis: 'Analyse IA complète',
    riskAssessmentFeature: 'Évaluation des risques',
    translationFeature: 'Traduction vers n\'importe quelle langue',
    noCommitment: 'Aucun engagement mensuel',
    documentHistory: 'Historique et gestion des documents',
    prioritySupport: 'Support prioritaire',
    viewFullPricing: 'Voir tous les tarifs',
    payPerDocument: 'Payer par document',
    payPerDocumentDesc: 'Parfait pour une utilisation occasionnelle',
    monthlySubscription: 'Abonnement mensuel',
    monthlySubscriptionDesc: 'Meilleure valeur pour les utilisateurs réguliers',
    trustedBy: 'Approuvé par plus de 500 startups et professionnels juridiques',
    users: 'Utilisateurs',
    soc2Compliant: 'Conforme SOC2',
    languages: 'Langues',
    advancedRedlining: 'Révision avancée',
    clauseEditing: 'Édition de clauses',
    countrySpecificReports: 'Rapports de risque spécifiques au pays',
    multiUserDashboard: 'Tableau de bord multi-utilisateurs',
    savedAnalysis: 'Analyses sauvegardées',
    docxExport: 'Exporter vers .docx',
    paymentMethods: 'Méthodes de paiement',
    creditCard: 'Carte de crédit',
    paypal: 'PayPal',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    crypto: 'Cryptomonnaie',
    legalSystem: 'Système juridique',
    usLaw: 'Droit américain',
    euLaw: 'Droit de l\'UE',
    ukLaw: 'Droit britannique',
    commonLaw: 'Common Law',
    civilLaw: 'Droit civil',
    mixedLaw: 'Système juridique mixte',
    jurisdictionUS: 'États-Unis',
    jurisdictionMX: 'Mexique',
    jurisdictionJP: 'Japon',
    jurisdictionRU: 'Russie',
    jurisdictionCN: 'Chine',
    jurisdictionAE: 'Émirats arabes unis',
    jurisdictionIN: 'Inde',
    jurisdictionBR: 'Brésil',
    jurisdictionPT: 'Portugal',
    jurisdictionCA: 'Canada',
    jurisdictionUK: 'Royaume-Uni',
    jurisdictionES: 'Espagne',
    jurisdictionDE: 'Allemagne',
    jurisdictionFR: 'France'
  },
  de: {
    // Header
    dashboard: 'Dashboard',
    analyzer: 'Analyzer',
    pricing: 'Preise',
    signIn: 'Anmelden',
    profile: 'Profil',
    billing: 'Abrechnung',
    settings: 'Einstellungen',
    logOut: 'Abmelden',
    
    // Hero Section
    heroTitle: 'Rechtsverträge mit KI analysieren',
    heroSubtitle: 'Erhalten Sie sofortige Risikobewertungen, mehrsprachige Übersetzungen und Expertenempfehlungen für Ihre Rechtsverträge. Speziell für Startups und wachsende Unternehmen entwickelt.',
    bankLevelSecurity: 'Bank-Level-Sicherheit',
    tenLanguages: '10 Sprachen',
    instantAnalysis: 'Sofortige Analyse',
    
    // Upload Section
    startAnalysis: 'Analyse starten',
    uploadDescription: 'Laden Sie Ihren Vertrag hoch oder fügen Sie den Text ein, um zu beginnen',
    contractLanguage: 'Vertragssprache:',
    uploadFile: 'Datei hochladen',
    pasteText: 'Text einfügen',
    uploadContract: 'Laden Sie Ihren Vertrag hoch',
    dragDropText: 'Ziehen Sie Ihre Vertragsdatei hierher oder klicken Sie zum Durchsuchen',
    chooseFile: 'Datei auswählen',
    supportedFormats: 'Unterstützt: .txt, .md Dateien',
    pasteContractText: 'Fügen Sie Ihren Vertragstext hier ein...',
    analyzeContract: 'Vertrag analysieren',
    analyzing: 'Analysiere...',
    analyzingContract: 'Vertrag wird analysiert...',
    analyzingDescription: 'Dies kann einige Momente dauern',
    
    // Features
    featuresTitle: 'Leistungsstarke Funktionen für Rechtsanalysen',
    featuresSubtitle: 'Alles was Sie brauchen, um Rechtsverträge sicher zu verstehen, zu übersetzen und zu vergleichen',
    riskAssessment: 'Risikobewertung',
    riskAssessmentDesc: 'KI-gestützte Analyse identifiziert potenzielle Risiken und bietet umsetzbare Empfehlungen basierend auf rechtlichem Kontext und Gerichtsbarkeit.',
    multilingualTranslation: 'Mehrsprachige Übersetzung',
    multilingualDesc: 'Übersetzen Sie Verträge in 10 Sprachen einschließlich Englisch, Mandarin, Spanisch, Arabisch und mehr mit Erhaltung des rechtlichen Kontexts.',
    
    // Pricing
    pricingTitle: 'Einfache, transparente Preise',
    pricingSubtitle: 'Alle Preise sind in US-Dollar (USD). Wählen Sie den Plan, der am besten für Ihr Unternehmen funktioniert',
    basicPlan: 'Basis-Plan',
    basicPlanDesc: 'Unbegrenzter Zugang zum Vertragsanalysator',
    unlimitedAnalysis: 'Unbegrenzte Vertragsanalyse',
    noContractGeneration: 'Beinhaltet keine Vertragserstellung',
    contractGenerationCost: 'Kosten pro Vertragserstellung: $0,80 USD pro Seite',
    cancelAnytime: 'Kündigung jederzeit möglich',
    aiPlusTitle: 'AI+ Plan',
    aiPlusDesc: 'Erweiterte Funktionen für Power-User',
    pdfWordExport: 'PDF- und Word-Dokumentexport mit Änderungsverfolgung',
    fiveContractsIncluded: '5 Verträge pro Monat ohne zusätzliche Kosten generiert',
    additionalContracts: 'Zusätzliche Verträge: $0,60 USD pro Seite',
    flexibleCancellation: 'Flexible Kündigung',
    teamTitle: 'Team-Plan',
    teamDesc: 'Kollaborationstools für Teams',
    tenContractsIncluded: '10 Verträge pro Monat ohne zusätzliche Kosten generiert',
    additionalContractsTeam: 'Zusätzliche Verträge: $0,50 USD pro Seite',
    multiUserCollaboration: 'Multi-User-Kollaboration aktiviert (E-Mail- oder Link-Einladungen)',
    unlimitedPlan: 'Unbegrenzter Plan',
    unlimitedPlanDesc: 'Unbegrenzte Vertragserstellung',
    unlimitedGeneration: 'Unbegrenzte Vertragserstellung',
    fullCollaborativeAccess: 'Vollzugriff auf kollaborative Funktionen',
    termsAndConditions: 'Allgemeine Geschäftsbedingungen',
    privacyNotice: 'Datenschutzhinweis',
    legalContextSupport: 'Mit kontextuellem Rechtssupport basierend auf der geltenden Gesetzgebung jedes Landes',
    perMonth: 'pro Monat',
    perDocument: 'pro Dokument',
    mostPopular: 'Am beliebtesten',
    fullAIAnalysis: 'Vollständige KI-Analyse',
    riskAssessmentFeature: 'Risikobewertung',
    translationFeature: 'Übersetzung in jede Sprache',
    noCommitment: 'Keine monatliche Verpflichtung',
    documentHistory: 'Dokumentenverlauf und -verwaltung',
    prioritySupport: 'Priority-Support',
    viewFullPricing: 'Vollständige Preise anzeigen',
    payPerDocument: 'Pro Dokument bezahlen',
    payPerDocumentDesc: 'Perfekt für gelegentliche Nutzung',
    monthlySubscription: 'Monatliches Abonnement',
    monthlySubscriptionDesc: 'Bester Wert für regelmäßige Nutzer',
    trustedBy: 'Vertraut von 500+ Startups und Rechtsprofis',
    users: 'Benutzer',
    soc2Compliant: 'SOC2-konform',
    languages: 'Sprachen',
    advancedRedlining: 'Erweiterte Überarbeitung',
    clauseEditing: 'Klauselbearbeitung',
    countrySpecificReports: 'Länderspezifische Risikoberichte',
    multiUserDashboard: 'Multi-User-Dashboard',
    savedAnalysis: 'Gespeicherte Analysen',
    docxExport: 'Nach .docx exportieren',
    paymentMethods: 'Zahlungsmethoden',
    creditCard: 'Kreditkarte',
    paypal: 'PayPal',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    crypto: 'Kryptowährung',
    legalSystem: 'Rechtssystem',
    usLaw: 'US-Recht',
    euLaw: 'EU-Recht',
    ukLaw: 'UK-Recht',
    commonLaw: 'Common Law',
    civilLaw: 'Zivilrecht',
    mixedLaw: 'Gemischtes Rechtssystem',
    jurisdictionUS: 'Vereinigte Staaten',
    jurisdictionMX: 'Mexiko',
    jurisdictionJP: 'Japan',
    jurisdictionRU: 'Russland',
    jurisdictionCN: 'China',
    jurisdictionAE: 'Vereinigte Arabische Emirate',
    jurisdictionIN: 'Indien',
    jurisdictionBR: 'Brasilien',
    jurisdictionPT: 'Portugal',
    jurisdictionCA: 'Kanada',
    jurisdictionUK: 'Vereinigtes Königreich',
    jurisdictionES: 'Spanien',
    jurisdictionDE: 'Deutschland',
    jurisdictionFR: 'Frankreich'
  }
  // Add more languages as needed...
}

export type TranslationKey = keyof typeof translations.en

export function getTranslation(key: TranslationKey, language: string = 'en'): string {
  const lang = language in translations ? language as keyof typeof translations : 'en'
  return translations[lang][key] || translations.en[key]
}

export function detectBrowserLanguage(): string {
  const browserLang = navigator.language.split('-')[0]
  return SUPPORTED_UI_LANGUAGES.find(lang => lang.code === browserLang)?.code || 'en'
}

export function getLegalSystemByLanguage(language: string): string {
  const legalSystems: Record<string, string> = {
    'en': 'usLaw',
    'es': 'civilLaw', // Mexico, Spain
    'zh': 'civilLaw', // China
    'ar': 'mixedLaw', // UAE (mixed with Sharia)
    'fr': 'civilLaw',
    'de': 'civilLaw',
    'pt': 'civilLaw',
    'pt-br': 'civilLaw', // Brazil
    'ja': 'civilLaw', // Japan
    'hi': 'mixedLaw', // India (mixed common/civil)
    'ru': 'civilLaw'  // Russia
  }
  return legalSystems[language] || 'commonLaw'
}

export function getJurisdictionByLanguage(language: string): string {
  const jurisdictions: Record<string, string> = {
    'en': 'US',
    'es': 'MX',
    'zh': 'CN',
    'ar': 'AE',
    'fr': 'FR',
    'de': 'DE',
    'pt': 'PT',
    'pt-br': 'BR',
    'ja': 'JP',
    'hi': 'IN',
    'ru': 'RU'
  }
  return jurisdictions[language] || 'US'
}