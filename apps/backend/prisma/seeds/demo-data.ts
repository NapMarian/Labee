import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with demo data...');

  // Password para todos los usuarios demo
  const password = await bcrypt.hash('Password123!', 10);

  // Crear 7 candidatos
  const candidatesData = [
    { email: 'ana.martinez@example.com', name: 'Ana Martinez', location: 'Buenos Aires', skills: ['React', 'Node.js', 'TypeScript'], yearsExperience: 3 },
    { email: 'carlos.rodriguez@example.com', name: 'Carlos Rodriguez', location: 'Cordoba', skills: ['Figma', 'Adobe XD', 'Design Systems'], yearsExperience: 5 },
    { email: 'lucia.fernandez@example.com', name: 'Lucia Fernandez', location: 'Rosario', skills: ['Python', 'Machine Learning', 'SQL'], yearsExperience: 4 },
    { email: 'diego.gomez@example.com', name: 'Diego Gomez', location: 'Mendoza', skills: ['Java', 'Spring Boot', 'AWS'], yearsExperience: 6 },
    { email: 'maria.lopez@example.com', name: 'Maria Lopez', location: 'Buenos Aires', skills: ['Scrum', 'Agile', 'JIRA'], yearsExperience: 7 },
    { email: 'pablo.silva@example.com', name: 'Pablo Silva', location: 'La Plata', skills: ['Docker', 'Kubernetes', 'Jenkins'], yearsExperience: 4 },
    { email: 'sofia.gonzalez@example.com', name: 'Sofia Gonzalez', location: 'Buenos Aires', skills: ['SEO', 'Google Analytics', 'Social Media'], yearsExperience: 5 },
  ];

  for (const data of candidatesData) {
    await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: password,
        userType: 'CANDIDATE',
        active: true,
        verified: true,
        profile: {
          create: {
            name: data.name,
            bio: `Profesional con ${data.yearsExperience} años de experiencia buscando nuevos desafios.`,
            location: data.location,
            skills: data.skills,
            yearsExperience: data.yearsExperience,
            workTypes: ['FULL_TIME'],
            categories: ['TECHNOLOGY']
          }
        }
      }
    });
    console.log(`Candidato creado: ${data.name}`);
  }

  // Crear 5 reclutadores
  const recruitersData = [
    { email: 'recruiter1@techcorp.com', name: 'Juan Perez', company: 'TechCorp Argentina' },
    { email: 'recruiter2@designstudio.com', name: 'Laura Sanchez', company: 'Design Studio BA' },
    { email: 'recruiter3@datacompany.com', name: 'Roberto Diaz', company: 'DataCompany' },
    { email: 'recruiter4@cloudtech.com', name: 'Gabriela Torres', company: 'CloudTech Solutions' },
    { email: 'recruiter5@marketingagency.com', name: 'Martin Ruiz', company: 'Marketing Growth Agency' },
  ];

  for (const data of recruitersData) {
    const recruiter = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: password,
        userType: 'RECRUITER',
        active: true,
        verified: true,
        profile: {
          create: {
            name: data.name,
            companyName: data.company,
            position: 'Recruiter',
            location: 'Buenos Aires, Argentina'
          }
        }
      }
    });

    // Crear 2 ofertas por reclutador
    await prisma.jobOffer.create({
      data: {
        recruiterId: recruiter.id,
        title: 'Senior Full Stack Developer',
        description: 'Buscamos un desarrollador Full Stack con experiencia en React y Node.js.',
        requirements: ['3+ años de experiencia', 'React', 'Node.js', 'TypeScript'],
        workType: 'FULL_TIME',
        category: 'TECHNOLOGY',
        location: 'Buenos Aires',
        remote: true,
        salaryMin: 150000,
        salaryMax: 200000,
        salaryCurrency: 'ARS',
        companyVisible: true,
        active: true
      }
    });

    await prisma.jobOffer.create({
      data: {
        recruiterId: recruiter.id,
        title: 'Frontend Developer React',
        description: 'Unite a nuestro equipo frontend para crear interfaces increibles.',
        requirements: ['2+ años de experiencia', 'React', 'CSS'],
        workType: 'FULL_TIME',
        category: 'TECHNOLOGY',
        location: 'Buenos Aires',
        remote: true,
        salaryMin: 120000,
        salaryMax: 160000,
        salaryCurrency: 'ARS',
        companyVisible: true,
        active: true
      }
    });

    console.log(`Reclutador creado: ${data.name} con 2 ofertas`);
  }

  console.log('');
  console.log('Database seeded successfully!');
  console.log('');
  console.log('Usuarios creados:');
  console.log('   - 7 Candidatos');
  console.log('   - 5 Reclutadores');
  console.log('   - 10 Ofertas de trabajo');
  console.log('');
  console.log('Password para todos: Password123!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
