import {
  Sparkles,
  Hammer,
  Trophy,
  Zap,
  HeartHandshake,
  Award,
  Medal,
  Crown,
  ShieldCheck,
  Rocket,
  MessageSquare,
  MapPin,
  Coins,
  Layers,
  Flame,
} from 'lucide-react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  points: number
  category: 'skills' | 'jobs' | 'reputation' | 'community'
  checkUnlocked: (stats: UserStats) => { unlocked: boolean; progress: number; maxProgress: number }
}

export interface UserStats {
  skillsCount: number
  completedJobsCount: number
  cryptoJobsCount: number
  inrJobsCount: number
  disputedJobsCount: number
  avgRating: number
  totalMonEarned: number
  totalInrEarned: number
  chatMessagesCount: number
  categoriesCount: number
  city: string
  joinedYear: number
}

export const COMMUNITY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_skill',
    title: 'First Step Provider',
    description: 'Listed your very first skill on the SkillMax community marketplace.',
    icon: Sparkles,
    points: 50,
    category: 'skills',
    checkUnlocked: (s) => ({
      unlocked: s.skillsCount >= 1,
      progress: Math.min(s.skillsCount, 1),
      maxProgress: 1,
    }),
  },
  {
    id: 'local_helper',
    title: 'Local Helper',
    description: 'Successfully completed your first local job for a neighbor.',
    icon: Hammer,
    points: 100,
    category: 'jobs',
    checkUnlocked: (s) => ({
      unlocked: s.completedJobsCount >= 1,
      progress: Math.min(s.completedJobsCount, 1),
      maxProgress: 1,
    }),
  },
  {
    id: 'five_star_hero',
    title: '5-Star Hero',
    description: 'Maintained a 5.0 rating across at least 3 completed jobs.',
    icon: Trophy,
    points: 250,
    category: 'reputation',
    checkUnlocked: (s) => ({
      unlocked: s.completedJobsCount >= 3 && s.avgRating >= 4.8,
      progress: s.completedJobsCount >= 3 && s.avgRating >= 4.8 ? 3 : Math.min(s.completedJobsCount, 3),
      maxProgress: 3,
    }),
  },
  {
    id: 'monad_master',
    title: 'Monad Master',
    description: 'Completed 3 or more non-custodial crypto escrow jobs on Monad Testnet.',
    icon: Zap,
    points: 300,
    category: 'jobs',
    checkUnlocked: (s) => ({
      unlocked: s.cryptoJobsCount >= 3,
      progress: Math.min(s.cryptoJobsCount, 3),
      maxProgress: 3,
    }),
  },
  {
    id: 'neighborhood_savior',
    title: 'Neighborhood Savior',
    description: 'Provided services across 2 or more distinct skill categories.',
    icon: HeartHandshake,
    points: 150,
    category: 'community',
    checkUnlocked: (s) => ({
      unlocked: s.categoriesCount >= 2,
      progress: Math.min(s.categoriesCount, 2),
      maxProgress: 2,
    }),
  },
  {
    id: 'bronze_provider',
    title: 'Bronze Provider',
    description: 'Successfully completed 3 local jobs.',
    icon: Award,
    points: 200,
    category: 'jobs',
    checkUnlocked: (s) => ({
      unlocked: s.completedJobsCount >= 3,
      progress: Math.min(s.completedJobsCount, 3),
      maxProgress: 3,
    }),
  },
  {
    id: 'silver_provider',
    title: 'Silver Provider',
    description: 'Successfully completed 10 local jobs.',
    icon: Medal,
    points: 500,
    category: 'jobs',
    checkUnlocked: (s) => ({
      unlocked: s.completedJobsCount >= 10,
      progress: Math.min(s.completedJobsCount, 10),
      maxProgress: 10,
    }),
  },
  {
    id: 'gold_legend',
    title: 'Gold Legend',
    description: 'Achieved 25 completed jobs on SkillMax.',
    icon: Crown,
    points: 1000,
    category: 'jobs',
    checkUnlocked: (s) => ({
      unlocked: s.completedJobsCount >= 25,
      progress: Math.min(s.completedJobsCount, 25),
      maxProgress: 25,
    }),
  },
  {
    id: 'escrow_champion',
    title: 'Trust Guardian',
    description: 'Completed 5+ jobs with 0 disputed escalations.',
    icon: ShieldCheck,
    points: 400,
    category: 'reputation',
    checkUnlocked: (s) => ({
      unlocked: s.completedJobsCount >= 5 && s.disputedJobsCount === 0,
      progress: s.disputedJobsCount === 0 ? Math.min(s.completedJobsCount, 5) : 0,
      maxProgress: 5,
    }),
  },
  {
    id: 'early_pioneer',
    title: 'Early Pioneer',
    description: 'Joined the SkillMax Monad community during the 2026 hackathon launch.',
    icon: Rocket,
    points: 100,
    category: 'community',
    checkUnlocked: (s) => ({
      unlocked: s.joinedYear <= 2026,
      progress: 1,
      maxProgress: 1,
    }),
  },
  {
    id: 'community_communicator',
    title: 'Community Communicator',
    description: 'Exchanged 10+ real-time chat messages with clients.',
    icon: MessageSquare,
    points: 150,
    category: 'community',
    checkUnlocked: (s) => ({
      unlocked: s.chatMessagesCount >= 10,
      progress: Math.min(s.chatMessagesCount, 10),
      maxProgress: 10,
    }),
  },
  {
    id: 'city_specialist',
    title: 'City Specialist',
    description: 'Set your home city and completed a verified local service.',
    icon: MapPin,
    points: 150,
    category: 'community',
    checkUnlocked: (s) => ({
      unlocked: Boolean(s.city) && s.completedJobsCount >= 1,
      progress: Boolean(s.city) && s.completedJobsCount >= 1 ? 1 : 0,
      maxProgress: 1,
    }),
  },
  {
    id: 'monad_earner',
    title: 'MON Escrow Earner',
    description: 'Earned at least 0.1 MON in platform smart contract escrows.',
    icon: Coins,
    points: 350,
    category: 'reputation',
    checkUnlocked: (s) => ({
      unlocked: s.totalMonEarned >= 0.1,
      progress: Math.min(Math.floor(s.totalMonEarned * 10), 1),
      maxProgress: 1,
    }),
  },
  {
    id: 'multi_talented',
    title: 'Multi-Talented',
    description: 'Created 3 or more active skill listings.',
    icon: Layers,
    points: 250,
    category: 'skills',
    checkUnlocked: (s) => ({
      unlocked: s.skillsCount >= 3,
      progress: Math.min(s.skillsCount, 3),
      maxProgress: 3,
    }),
  },
  {
    id: 'community_leader',
    title: 'Community Leader',
    description: 'Earned over 500 total community reputation points.',
    icon: Flame,
    points: 500,
    category: 'reputation',
    checkUnlocked: (s) => {
      // Calculate total points from other achievements
      const basicPoints = (s.skillsCount >= 1 ? 50 : 0) + (s.completedJobsCount * 100)
      return {
        unlocked: basicPoints >= 500,
        progress: Math.min(basicPoints, 500),
        maxProgress: 500,
      }
    },
  },
]
