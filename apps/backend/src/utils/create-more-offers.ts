import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newOffers = [
  {
    title: 'Backend Developer',
    companyName: 'StartupTech',
    description: 'Desarrollo de APIs con Node.js y PostgreSQL. Experiencia con microservicios y bases de datos relacionales.',
    location: 'Buenos Aires',
    workType: 'FULL_TIME',
    remote: true,
    category: 'TECHNOLOGY',
    salaryMin: 120000,
    salaryMax: 180000,
    requirements: ['Node.js', 'PostgreSQL', 'REST APIs']
  },
  {
    title: 'Data Analyst',
    companyName: 'DataCorp',
    description: 'Análisis de datos y visualización con Python. Trabajo con grandes volúmenes de datos.',
    location: 'Córdoba',
    workType: 'FULL_TIME',
    remote: false,
    category: 'TECHNOLOGY',
    salaryMin: 100000,
    salaryMax: 150000,
    requirements: ['Python', 'SQL', 'Power BI']
  },
  {
    title: 'Product Manager',
    companyName: 'InnovateLab',
    description: 'Gestión de productos digitales. Definición de roadmap y coordinación con equipos técnicos.',
    location: 'Rosario',
    workType: 'FULL_TIME',
    remote: false,
    category: 'TECHNOLOGY',
    salaryMin: 150000,
    salaryMax: 220000,
    requirements: ['Agile', 'Product Strategy', 'Stakeholder Management']
  },
  {
    title: 'UX/UI Designer Senior',
    companyName: 'DesignStudio',
    description: 'Diseño de experiencias de usuario para apps móviles. Portfolio requerido.',
    location: 'Buenos Aires',
    workType: 'FULL_TIME',
    remote: true,
    category: 'DESIGN',
    salaryMin: 110000,
    salaryMax: 160000,
    requirements: ['Figma', 'Adobe XD', 'User Research']
  },
  {
    title: 'DevOps Engineer',
    companyName: 'CloudSystems',
    description: 'Infraestructura cloud con AWS y Kubernetes. Automatización de deployments.',
    location: 'Mendoza',
    workType: 'FULL_TIME',
    remote: true,
    category: 'TECHNOLOGY',
    salaryMin: 140000,
    salaryMax: 200000,
    requirements: ['AWS', 'Kubernetes', 'Docker', 'CI/CD']
  },
  {
    title: 'Marketing Digital Specialist',
    companyName: 'MarketingPlus',
    description: 'Estrategias de marketing digital y SEO. Gestión de campañas en redes sociales.',
    location: 'Buenos Aires',
    workType: 'FULL_TIME',
    remote: false,
    category: 'MARKETING',
    salaryMin: 90000,
    salaryMax: 130000,
    requirements: ['SEO', 'Google Ads', 'Social Media']
  },
  {
    title: 'Mobile Developer iOS',
    companyName: 'AppMakers',
    description: 'Desarrollo de aplicaciones nativas para iOS con Swift.',
    location: 'Buenos Aires',
    workType: 'FULL_TIME',
    remote: true,
    category: 'TECHNOLOGY',
    salaryMin: 130000,
    salaryMax: 190000,
    requirements: ['Swift', 'SwiftUI', 'iOS SDK']
  },
  {
    title: 'Scrum Master',
    companyName: 'AgileTech',
    description: 'Facilitación de equipos ágiles. Certificación Scrum Master requerida.',
    location: 'Córdoba',
    workType: 'FULL_TIME',
    remote: false,
    category: 'TECHNOLOGY',
    salaryMin: 100000,
    salaryMax: 140000,
    requirements: ['Scrum', 'Jira', 'Team Coaching']
  },
  {
    title: 'Cybersecurity Analyst',
    companyName: 'SecureTech',
    description: 'Análisis y prevención de amenazas de seguridad. Monitoreo de sistemas.',
    location: 'Buenos Aires',
    workType: 'FULL_TIME',
    remote: false,
    category: 'TECHNOLOGY',
    salaryMin: 120000,
    salaryMax: 170000,
    requirements: ['Security', 'Penetration Testing', 'SIEM']
  },
  {
    title: 'Content Creator',
    companyName: 'MediaHub',
    description: 'Creación de contenido para redes sociales. Video y fotografía.',
    location: 'Rosario',
    workType: 'FREELANCE',
    remote: true,
    category: 'MEDIA',
    salaryMin: 70000,
    salaryMax: 110000,
    requirements: ['Content Creation', 'Video Editing', 'Social Media']
  },
  {
    title: 'Business Analyst',
    companyName: 'ConsultingGroup',
    description: 'Análisis de procesos de negocio. Optimización de operaciones.',
    location: 'Buenos Aires',
    workType: 'FULL_TIME',
    remote: false,
    category: 'ADMINISTRATION',
    salaryMin: 95000,
    salaryMax: 140000,
    requirements: ['Process Analysis', 'Data Analysis', 'Excel']
  },
  {
    title: 'QA Automation Engineer',
    companyName: 'QualityFirst',
    description: 'Automatización de pruebas con Selenium y Cypress.',
    location: 'Buenos Aires',
    workType: 'FULL_TIME',
    remote: true,
    category: 'TECHNOLOGY',
    salaryMin: 110000,
    salaryMax: 160000,
    requirements: ['Selenium', 'Cypress', 'JavaScript']
  },
  {
    title: 'Sales Manager',
    companyName: 'SalesForce Inc',
    description: 'Gestión de equipo de ventas B2B. Alcanzar objetivos de ventas.',
    location: 'Mendoza',
    workType: 'FULL_TIME',
    remote: false,
    category: 'SALES',
    salaryMin: 130000,
    salaryMax: 200000,
    requirements: ['B2B Sales', 'Team Management', 'CRM']
  },
  {
    title: 'Machine Learning Engineer',
    companyName: 'AI Labs',
    description: 'Desarrollo de modelos de ML y AI. Experiencia con TensorFlow y PyTorch.',
    location: 'Buenos Aires',
    workType: 'FULL_TIME',
    remote: true,
    category: 'TECHNOLOGY',
    salaryMin: 160000,
    salaryMax: 240000,
    requirements: ['Python', 'TensorFlow', 'Machine Learning']
  },
  {
    title: 'HR Specialist',
    companyName: 'PeopleFirst',
    description: 'Gestión de recursos humanos y reclutamiento. Desarrollo de talento.',
    location: 'Córdoba',
    workType: 'FULL_TIME',
    remote: false,
    category: 'HR',
    salaryMin: 85000,
    salaryMax: 120000,
    requirements: ['Recruitment', 'HR Management', 'Talent Development']
  }
];

async function createOffers() {
  try {
    // Obtener un reclutador aleatorio
    const recruiters = await prisma.user.findMany({
      where: { userType: 'RECRUITER' },
      select: { id: true }
    });

    if (recruiters.length === 0) {
      console.log('No hay reclutadores en la base de datos');
      return;
    }

    console.log('Creando nuevas ofertas de trabajo...');

    for (const offer of newOffers) {
      const randomRecruiter = recruiters[Math.floor(Math.random() * recruiters.length)];

      await prisma.jobOffer.create({
        data: {
          ...offer,
          recruiterId: randomRecruiter.id,
          active: true
        }
      });
    }

    console.log(`✅ Se crearon ${newOffers.length} nuevas ofertas de trabajo`);

    const total = await prisma.jobOffer.count();
    console.log(`Total de ofertas en la base de datos: ${total}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOffers();