module.exports = [
  {
    id: 'ai-booking-assistant',
    title: 'AI Restaurant Booking Assistant',
    image: '/images/project-ai-chatbot.jpg',
    alt: 'Chat interface for the AI restaurant booking assistant',
    role: 'Developer & Integrator',
    description:
      'A conversational booking assistant that helps guests reserve tables through natural language. Built with a LangGraph agent workflow, it retrieves restaurant and menu knowledge using Retrieval-Augmented Generation (RAG) over a Pinecone vector index, and keeps persistent conversation memory in PostgreSQL.',
    techStack: ['LangGraph', 'RAG', 'Pinecone', 'PostgreSQL', 'Claude API'],
    outcome:
      'Delivered a working prototype that handles multi-turn conversations, remembers returning customers, and reduces manual booking workload for restaurant staff.',
  },
  {
    id: 'aks-banking-architecture',
    title: 'Bank-Grade AKS Cloud Architecture',
    image: '/images/project-cloud-architecture.jpg',
    alt: 'Cloud architecture diagram on an Azure Kubernetes Service cluster',
    role: 'Cloud Architect (project case study)',
    description:
      'Designed a secure, microservices-based architecture for a banking scenario running on Azure Kubernetes Service (AKS). All infrastructure is provisioned as code with Terraform, with network policies, managed identities, and secret management applied to meet security requirements.',
    techStack: ['Azure', 'AKS', 'Terraform', 'Kubernetes', 'Docker'],
    outcome:
      'Produced a reusable Infrastructure-as-Code blueprint with a documented security design that can be adapted to other regulated workloads.',
  },
  {
    id: 'cloudops-monitoring',
    title: 'CloudOps VM Monitoring Automation',
    image: '/images/project-monitoring.jpg',
    alt: 'Dashboard screen showing virtual machine monitoring data',
    role: 'Automation Developer',
    description:
      'A Python-based automation tool that monitors Azure virtual machines, tracks their running state, automates scheduled start/stop to control cost, and reports anomalies through the Azure SDK.',
    techStack: ['Python', 'Azure SDK', 'PowerShell', 'Bash', 'CI/CD'],
    outcome:
      'Automated routine operations that previously required manual checks, cutting response time and reducing cloud spending on idle resources.',
  },
];
