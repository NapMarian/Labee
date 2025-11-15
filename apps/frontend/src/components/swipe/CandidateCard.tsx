import { User } from '@/types';
import { MapPin, Briefcase, GraduationCap, Mail, Phone, FileText, User as UserIcon } from 'lucide-react';
import { getImageUrl } from '@/lib/api';

interface CandidateCardProps {
  candidate: User;
}

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const profile = candidate.profile;
  const avatarUrl = getImageUrl(profile?.avatar);

  return (
    <div className="w-full h-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header con avatar y nombre */}
      <div className="bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 p-6 text-white">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={profile?.name || 'Candidate'}
              className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur object-cover border-2 border-white/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border-2 border-white/20 flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-white/80" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile?.name || 'Candidato'}</h2>
            {profile?.location && (
              <p className="text-gray-200 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Badges de disponibilidad */}
        <div className="flex flex-wrap gap-2">
          {profile?.workTypes && profile.workTypes.length > 0 && (
            profile.workTypes.map((workType, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-200/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium border border-gray-300/50 dark:border-gray-600/50"
              >
                {workType}
              </span>
            ))
          )}
        </div>

        {/* Categorías de interés */}
        {profile?.categories && profile.categories.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Áreas de interés</h3>
            <div className="flex flex-wrap gap-2">
              {profile.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 rounded-full text-sm border border-gray-300/50 dark:border-gray-600/50"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Biografía */}
        {profile?.bio && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Sobre mí</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Experiencia */}
        {profile?.yearsExperience !== null && profile?.yearsExperience !== undefined && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">
              {profile.yearsExperience} {profile.yearsExperience === 1 ? 'año' : 'años'} de experiencia
            </span>
          </div>
        )}

        {/* Skills */}
        {profile?.skills && profile.skills.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Habilidades</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium border border-gray-300/50 dark:border-gray-600/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experiencia laboral */}
        {profile?.experience && profile.experience.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Experiencia Laboral</h3>
            <div className="space-y-3">
              {profile.experience.map((exp: any, index: number) => (
                <div key={index} className="border-l-2 border-gray-400 dark:border-gray-600 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{exp.position}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                  {exp.period && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">{exp.period}</p>
                  )}
                  {exp.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educación */}
        {profile?.education && profile.education.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Educación
            </h3>
            <div className="space-y-2">
              {profile.education.map((edu: any, index: number) => (
                <div key={index} className="border-l-2 border-gray-400 dark:border-gray-600 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{edu.degree}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                  {edu.year && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">{edu.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información de contacto */}
        {profile?.phone && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{profile.phone}</span>
          </div>
        )}

        {candidate.email && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{candidate.email}</span>
          </div>
        )}

        {/* CV disponible */}
        {profile?.resume && (
          <div className="mt-4 p-3 backdrop-blur-xl bg-blue-100/50 dark:bg-blue-900/30 border border-blue-300/50 dark:border-blue-700/50 rounded-xl">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <FileText className="w-5 h-5" />
              <span className="font-medium">CV disponible</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer con instrucciones */}
      <div className="p-4 backdrop-blur-xl bg-gray-100/50 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Desliza → para dar like o ← para pasar
        </p>
      </div>
    </div>
  );
};
