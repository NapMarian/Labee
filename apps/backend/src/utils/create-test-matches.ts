import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestMatches() {
  try {
    // Obtener el usuario candidato
    const candidate = await prisma.user.findUnique({
      where: { email: 'marianoknaap2@gmail.com' },
    });

    if (!candidate) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`✅ Usuario encontrado: ${candidate.email} (${candidate.userType})`);

    // Obtener algunas ofertas de trabajo aleatorias
    const offers = await prisma.jobOffer.findMany({
      where: { active: true },
      include: {
        recruiter: true,
      },
      take: 5,
    });

    console.log(`\n📋 Se encontraron ${offers.length} ofertas de trabajo`);

    let matchesCreated = 0;

    for (const offer of offers) {
      try {
        // 1. Candidato da LIKE a la oferta
        const candidateSwipe = await prisma.swipe.upsert({
          where: {
            swiperId_jobOfferId: {
              swiperId: candidate.id,
              jobOfferId: offer.id,
            },
          },
          create: {
            swiperId: candidate.id,
            jobOfferId: offer.id,
            liked: true,
          },
          update: {
            liked: true,
          },
        });

        console.log(`  ✓ Candidato dio LIKE a: ${offer.title}`);

        // 2. Reclutador da LIKE al candidato
        const recruiterSwipe = await prisma.swipe.upsert({
          where: {
            swiperId_targetUserId: {
              swiperId: offer.recruiterId,
              targetUserId: candidate.id,
            },
          },
          create: {
            swiperId: offer.recruiterId,
            targetUserId: candidate.id,
            liked: true,
          },
          update: {
            liked: true,
          },
        });

        console.log(`  ✓ Reclutador dio LIKE al candidato`);

        // 3. Verificar si ya existe el match
        const existingMatch = await prisma.match.findFirst({
          where: {
            OR: [
              { user1Id: candidate.id, user2Id: offer.recruiterId, jobOfferId: offer.id },
              { user1Id: offer.recruiterId, user2Id: candidate.id, jobOfferId: offer.id },
            ],
          },
        });

        if (existingMatch) {
          console.log(`  ⚠️ Match ya existe para: ${offer.title}\n`);
        } else {
          // 4. Crear el match
          const match = await prisma.match.create({
            data: {
              user1Id: candidate.id,
              user2Id: offer.recruiterId,
              jobOfferId: offer.id,
              active: true,
            },
          });

          console.log(`  🎉 ¡MATCH CREADO! para: ${offer.title}\n`);
          matchesCreated++;
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️ Swipe ya existe para: ${offer.title}\n`);
        } else {
          console.error(`  ❌ Error con ${offer.title}:`, error.message, '\n');
        }
      }
    }

    console.log(`\n✅ Proceso completado`);
    console.log(`🎯 Matches nuevos creados: ${matchesCreated}`);
    console.log(`\n💬 Ahora puedes ir a /dashboard/messages para chatear!`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestMatches();
