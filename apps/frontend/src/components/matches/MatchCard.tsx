import { Match } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { Building2, MapPin, Briefcase, MessageSquare, Trash2, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import Card from '../ui/Card';

interface MatchCardProps {
  match: Match;
  onUnmatch: (matchId: string) => void;
  onMessage: (matchId: string) => void;
}

export const MatchCard = ({ match, onUnmatch, onMessage }: MatchCardProps) => {
  const { user } = useAuthStore();
  const [showUnmatchConfirm, setShowUnmatchConfirm] = useState(false);

  // Determinar el otro usuario en el match
  const otherUser = match.user1Id === user?.id ? match.user2 : match.user1;
  const profile = otherUser?.profile;
  const isCandidate = user?.userType === 'CANDIDATE';

  const handleUnmatch = () => {
    onUnmatch(match.id);
    setShowUnmatchConfirm(false);
  };

  return (
    <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10 hover:scale-[1.02] transition-transform duration-200">
      <div className="p-6">
        {/* Header con avatar y nombre */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur object-cover border border-white/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center border border-white/20">
                {isCandidate ? (
                  <Building2 className="w-8 h-8 text-white/80" />
                ) : (
                  <UserIcon className="w-8 h-8 text-white/80" />
                )}
              </div>
            )}
          </div>

          {/* Info del usuario */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
              {profile?.name || 'Usuario'}
            </h3>

            {/* Para candidatos: mostrar empresa y posición */}
            {isCandidate && (
              <>
                {profile?.companyName && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {profile.companyName}
                  </p>
                )}
                {match.jobOffer && (
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                    {match.jobOffer.title}
                  </p>
                )}
              </>
            )}

            {/* Para reclutadores: mostrar ubicación y experiencia */}
            {!isCandidate && (
              <>
                {profile?.location && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </p>
                )}
                {profile?.yearsExperience !== null && profile?.yearsExperience !== undefined && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {profile.yearsExperience} {profile.yearsExperience === 1 ? 'año' : 'años'} de experiencia
                  </p>
                )}
              </>
            )}

            {/* Skills o categorías (primeras 3) */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {profile.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-200/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 rounded text-xs border border-gray-300/50 dark:border-gray-600/50"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                    +{profile.skills.length - 3} más
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Offer Info (si aplica) */}
        {match.jobOffer && !isCandidate && (
          <div className="mb-4 p-3 backdrop-blur-xl bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Match para la posición:</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {match.jobOffer.title}
            </p>
          </div>
        )}

        {/* Fecha del match */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Match realizado el {new Date(match.createdAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>

        {/* Actions */}
        {!showUnmatchConfirm ? (
          <div className="flex gap-2">
            <button
              onClick={() => onMessage(match.id)}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              Enviar mensaje
            </button>
            <button
              onClick={() => setShowUnmatchConfirm(true)}
              className="px-4 py-2.5 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-3 backdrop-blur-xl bg-red-100/80 dark:bg-red-900/30 border border-red-300/50 dark:border-red-700/50 rounded-xl">
            <p className="text-sm text-red-700 dark:text-red-300 mb-3 text-center">
              ¿Estás seguro de eliminar este match?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUnmatch}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setShowUnmatchConfirm(false)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
