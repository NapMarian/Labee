import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Creando reclutadores y ofertas...');

  // Password para todos los usuarios demo
  const password = await bcrypt.hash('Password123!', 10);

  // Crear 5 reclutadores
  const recruitersData = [
    { email: 'recruiter1@techcorp.com', name: 'Juan Perez', company: 'TechCorp Argentina' },
    { email: 'recruiter2@designstudio.com', name: 'Laura Sanchez', company: 'Design Studio BA' },
    { email: 'recruiter3@datacompany.com', name: 'Roberto Diaz', company: 'DataCompany' },
    { email: 'recruiter4@cloudtech.com', name: 'Gabriela Torres', company: 'CloudTech Solutions' },
    { email: 'recruiter5@marketingagency.com', name: 'Martin Ruiz', company: 'Marketing Growth Agency' },
  ];

  for (const data of recruitersData) {
    // Verificar si ya existe
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existing) {
      console.log(`Reclutador ya existe: ${data.name}`);
      continue;
    }

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
        description: 'Buscamos un desarrollador Full Stack con experiencia en React y Node.js para unirse a nuestro equipo.',
        requirements: ['3+ años de experiencia', 'React', 'Node.js', 'TypeScript'],
        workType: 'FULL_TIME',
        category: 'TECHNOLOGY',
        location: 'Buenos Aires',
        remote: true,
        salaryMin: 150000,
        salaryMax: 200000,
        salaryCurrency: 'ARS',
        companyName: data.company,
        companyVisible: true,
        active: true
      }
    });

    await prisma.jobOffer.create({
      data: {
        recruiterId: recruiter.id,
        title: 'Frontend Developer React',
        description: 'Unite a nuestro equipo frontend para crear interfaces increibles y experiencias de usuario memorables.',
        requirements: ['2+ años de experiencia', 'React', 'CSS', 'JavaScript'],
        workType: 'FULL_TIME',
        category: 'TECHNOLOGY',
        location: 'Buenos Aires',
        remote: true,
        salaryMin: 120000,
        salaryMax: 160000,
        salaryCurrency: 'ARS',
        companyName: data.company,
        companyVisible: true,
        active: true
      }
    });

    console.log(`✅ Reclutador creado: ${data.name} con 2 ofertas`);
  }

  console.log('\n🎉 Reclutadores y ofertas creados exitosamente!');
  console.log('\nResumen:');
  console.log('   - 5 Reclutadores');
  console.log('   - 10 Ofertas de trabajo');
  console.log('\n🔑 Password para todos: Password123!\n');
}

main()
  .catch((e) => {
    console.error('Error creando reclutadores:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
