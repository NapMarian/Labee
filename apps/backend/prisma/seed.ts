import 'dotenv/config';
import { PrismaClient, UserType, WorkType, JobCategory } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.jobOffer.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // Password hasheado para todos los usuarios de prueba: "Password123!"
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  // Crear candidatos
  const candidate1 = await prisma.user.create({
    data: {
      email: 'maria.garcia@example.com',
      passwordHash: hashedPassword,
      userType: UserType.CANDIDATE,
      verified: true,
      profile: {
        create: {
          name: 'María García',
          bio: 'Desarrolladora Full Stack con 3 años de experiencia. Apasionada por crear productos que impacten positivamente.',
          location: 'Buenos Aires, Argentina',
          skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL'],
          workTypes: [WorkType.FULL_TIME, WorkType.FREELANCE],
          categories: [JobCategory.TECHNOLOGY],
          yearsExperience: 3,
          experience: [
            {
              company: 'Tech Startup',
              position: 'Full Stack Developer',
              years: 2,
              description: 'Desarrollo de aplicaciones web con React y Node.js'
            }
          ]
        }
      }
    }
  });

  const candidate2 = await prisma.user.create({
    data: {
      email: 'juan.perez@example.com',
      passwordHash: hashedPassword,
      userType: UserType.CANDIDATE,
      verified: true,
      profile: {
        create: {
          name: 'Juan Pérez',
          bio: 'Especialista en ventas B2B con enfoque en tecnología. 5 años cerrando deals importantes.',
          location: 'Córdoba, Argentina',
          skills: ['Ventas B2B', 'Negociación', 'CRM', 'Prospección'],
          workTypes: [WorkType.FULL_TIME],
          categories: [JobCategory.SALES],
          yearsExperience: 5,
          experience: [
            {
              company: 'Software Corp',
              position: 'Sales Executive',
              years: 3,
              description: 'Ventas de software empresarial'
            }
          ]
        }
      }
    }
  });

  const candidate3 = await prisma.user.create({
    data: {
      email: 'laura.martinez@example.com',
      passwordHash: hashedPassword,
      userType: UserType.CANDIDATE,
      verified: true,
      profile: {
        create: {
          name: 'Laura Martínez',
          bio: 'Diseñadora UX/UI creativa. Me encanta resolver problemas complejos con diseños simples.',
          location: 'Rosario, Argentina',
          skills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping'],
          workTypes: [WorkType.FULL_TIME, WorkType.PART_TIME, WorkType.FREELANCE],
          categories: [JobCategory.DESIGN],
          yearsExperience: 4,
          experience: [
            {
              company: 'Design Agency',
              position: 'Senior UX Designer',
              years: 4,
              description: 'Diseño de experiencias digitales para startups'
            }
          ]
        }
      }
    }
  });

  console.log('✅ Created 3 candidates');

  // Crear reclutadores
  const recruiter1 = await prisma.user.create({
    data: {
      email: 'hr@techcorp.com',
      passwordHash: hashedPassword,
      userType: UserType.RECRUITER,
      verified: true,
      profile: {
        create: {
          name: 'Ana López',
          bio: 'Reclutadora en TechCorp. Buscamos talento excepcional para nuestro equipo.',
          location: 'Buenos Aires, Argentina',
          companyName: 'TechCorp',
          position: 'HR Manager'
        }
      }
    }
  });

  const recruiter2 = await prisma.user.create({
    data: {
      email: 'jobs@startup.io',
      passwordHash: hashedPassword,
      userType: UserType.RECRUITER,
      verified: true,
      profile: {
        create: {
          name: 'Carlos Ruiz',
          bio: 'Fundador de StartupIO. Estamos revolucionando el e-commerce.',
          location: 'Mendoza, Argentina',
          companyName: 'StartupIO',
          position: 'CEO & Founder'
        }
      }
    }
  });

  console.log('✅ Created 2 recruiters');

  // Crear ofertas de trabajo
  const job1 = await prisma.jobOffer.create({
    data: {
      recruiterId: recruiter1.id,
      title: 'Full Stack Developer',
      description: 'Buscamos un desarrollador Full Stack para unirse a nuestro equipo de producto. Trabajarás en proyectos innovadores usando tecnologías modernas.',
      requirements: [
        '3+ años de experiencia con React',
        'Conocimiento de Node.js',
        'Experiencia con bases de datos SQL',
        'Inglés intermedio'
      ],
      workType: WorkType.FULL_TIME,
      category: JobCategory.TECHNOLOGY,
      location: 'Buenos Aires',
      remote: true,
      salaryMin: 3000,
      salaryMax: 5000,
      salaryCurrency: 'USD',
      companyName: 'TechCorp',
      companyVisible: true,
      active: true
    }
  });

  const job2 = await prisma.jobOffer.create({
    data: {
      recruiterId: recruiter1.id,
      title: 'Senior UX/UI Designer',
      description: 'Buscamos un diseñador senior para liderar el diseño de nuestros productos digitales.',
      requirements: [
        '4+ años de experiencia en UX/UI',
        'Dominio de Figma',
        'Portfolio sólido',
        'Experiencia liderando equipos'
      ],
      workType: WorkType.FULL_TIME,
      category: JobCategory.DESIGN,
      location: 'Buenos Aires',
      remote: true,
      salaryMin: 2500,
      salaryMax: 4000,
      salaryCurrency: 'USD',
      companyName: 'TechCorp',
      companyVisible: true,
      active: true
    }
  });

  const job3 = await prisma.jobOffer.create({
    data: {
      recruiterId: recruiter2.id,
      title: 'Sales Manager - B2B',
      description: 'Estamos buscando un Sales Manager con experiencia en ventas B2B para expandir nuestro negocio.',
      requirements: [
        '5+ años en ventas B2B',
        'Experiencia en tech/SaaS',
        'Inglés fluido',
        'Excelentes habilidades de negociación'
      ],
      workType: WorkType.FULL_TIME,
      category: JobCategory.SALES,
      location: 'Mendoza',
      remote: false,
      salaryMin: 2000,
      salaryMax: 3500,
      salaryCurrency: 'USD',
      companyName: 'StartupIO',
      companyVisible: true,
      active: true
    }
  });

  const job4 = await prisma.jobOffer.create({
    data: {
      recruiterId: recruiter2.id,
      title: 'Frontend Developer (React)',
      description: 'Desarrollador Frontend para trabajar en nuestra plataforma de e-commerce. Remoto 100%.',
      requirements: [
        '2+ años con React',
        'TypeScript',
        'Responsive design',
        'Git flow'
      ],
      workType: WorkType.FULL_TIME,
      category: JobCategory.TECHNOLOGY,
      location: 'Argentina',
      remote: true,
      salaryMin: 2000,
      salaryMax: 3500,
      salaryCurrency: 'USD',
      companyName: 'StartupIO',
      companyVisible: true,
      active: true
    }
  });

  console.log('✅ Created 4 job offers');

  // Crear algunos swipes de ejemplo
  await prisma.swipe.create({
    data: {
      swiperId: candidate1.id,
      jobOfferId: job1.id,
      liked: true
    }
  });

  await prisma.swipe.create({
    data: {
      swiperId: candidate1.id,
      jobOfferId: job4.id,
      liked: true
    }
  });

  await prisma.swipe.create({
    data: {
      swiperId: candidate3.id,
      jobOfferId: job2.id,
      liked: true
    }
  });

  console.log('✅ Created sample swipes');

  // Crear un match y mensajes de ejemplo
  const match1 = await prisma.match.create({
    data: {
      user1Id: candidate1.id,
      user2Id: recruiter1.id,
      jobOfferId: job1.id
    }
  });

  await prisma.message.createMany({
    data: [
      {
        matchId: match1.id,
        senderId: recruiter1.id,
        content: '¡Hola María! Vi tu perfil y me encantó. ¿Te gustaría que agendemos una entrevista?',
        read: true
      },
      {
        matchId: match1.id,
        senderId: candidate1.id,
        content: '¡Hola Ana! Sí, me encantaría. ¿Cuándo tendrías disponibilidad?',
        read: true
      },
      {
        matchId: match1.id,
        senderId: recruiter1.id,
        content: '¿Qué tal el próximo martes a las 15:00?',
        read: false
      }
    ]
  });

  console.log('✅ Created sample match and messages');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Test users:');
  console.log('Candidates:');
  console.log('  - maria.garcia@example.com (Password123!)');
  console.log('  - juan.perez@example.com (Password123!)');
  console.log('  - laura.martinez@example.com (Password123!)');
  console.log('\nRecruiters:');
  console.log('  - hr@techcorp.com (Password123!)');
  console.log('  - jobs@startup.io (Password123!)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
