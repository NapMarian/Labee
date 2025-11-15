import { JobOffer } from '@/types';
import { getImageUrl } from '@/lib/api';
import { Briefcase, MapPin, DollarSign, Building2 } from 'lucide-react';

interface JobOfferCardProps {
  offer: JobOffer;
}

export const JobOfferCard = ({ offer }: JobOfferCardProps) => {
  const companyLogoUrl = getImageUrl(offer.recruiter?.profile?.companyLogo);

  return (
    <div className="w-full h-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header con logo de empresa */}
      <div className="bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 p-6 text-white">
        <div className="flex items-center gap-4">
          {companyLogoUrl ? (
            <img
              src={companyLogoUrl}
              alt={offer.recruiter?.profile?.companyName || 'Company'}
              className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur object-cover border border-white/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white/80" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{offer.title}</h2>
            <p className="text-gray-200 flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {offer.recruiter?.profile?.companyName || offer.companyName || 'Company'}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Badges de tipo de trabajo y categoría */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-gray-200/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium border border-gray-300/50 dark:border-gray-600/50">
            <Briefcase className="w-3 h-3 inline mr-1" />
            {offer.workType}
          </span>
          <span className="px-3 py-1.5 bg-gray-200/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium border border-gray-300/50 dark:border-gray-600/50">
            {offer.category}
          </span>
          {offer.remote && (
            <span className="px-3 py-1.5 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-300/50 dark:border-blue-700/50">
              🌍 Remoto
            </span>
          )}
        </div>

        {/* Ubicación y salario */}
        <div className="space-y-2">
          {offer.location && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{offer.location}</span>
            </div>
          )}
          {offer.salaryRange && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">{offer.salaryRange}</span>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Descripción</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
            {offer.description}
          </p>
        </div>

        {/* Requisitos */}
        {offer.requirements && offer.requirements.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Requisitos</h3>
            <ul className="space-y-1">
              {offer.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-gray-700 dark:text-gray-300 mt-1">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills requeridas */}
        {offer.requiredSkills && offer.requiredSkills.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Skills Requeridas</h3>
            <div className="flex flex-wrap gap-2">
              {offer.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 rounded-lg text-sm border border-gray-300/50 dark:border-gray-600/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Beneficios */}
        {offer.benefits && offer.benefits.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Beneficios</h3>
            <ul className="space-y-1">
              {offer.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-blue-500 dark:text-blue-400 mt-1">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer con info adicional */}
      <div className="p-4 backdrop-blur-xl bg-gray-100/50 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Desliza → para dar like o ← para pasar
        </p>
      </div>
    </div>
  );
};
