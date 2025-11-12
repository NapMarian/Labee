import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    const offers = await prisma.jobOffer.count();
    const candidates = await prisma.user.count({ where: { userType: 'CANDIDATE' } });
    const recruiters = await prisma.user.count({ where: { userType: 'RECRUITER' } });
    const swipes = await prisma.swipe.count();

    console.log('=== ESTADÍSTICAS DE LA BASE DE DATOS ===');
    console.log('Ofertas de trabajo:', offers);
    console.log('Candidatos:', candidates);
    console.log('Reclutadores:', recruiters);
    console.log('Total de swipes:', swipes);

    // Verificar swipes del usuario marianoknaap2@gmail.com
    const user = await prisma.user.findUnique({
      where: { email: 'marianoknaap2@gmail.com' },
      select: { id: true, userType: true }
    });

    if (user) {
      const userSwipes = await prisma.swipe.count({
        where: { swiperId: user.id }
      });

      console.log(`\nSwipes de marianoknaap2@gmail.com (${user.userType}):`, userSwipes);

      if (user.userType === 'CANDIDATE') {
        console.log('Ofertas disponibles para swipear:', offers - userSwipes);
      } else {
        console.log('Candidatos disponibles para swipear:', candidates - userSwipes);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();