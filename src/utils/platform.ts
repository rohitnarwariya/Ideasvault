import { Platform } from '../types';
import { 
  Youtube, 
  Instagram, 
  Pin, 
  Globe, 
  Twitter, 
  MessageCircle,
  HelpCircle
} from 'lucide-react';

export const detectPlatform = (url: string): Platform => {
  if (!url) return 'website';
  const cleanUrl = url.toLowerCase().trim();
  
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    return 'youtube';
  }
  if (cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')) {
    return 'instagram';
  }
  if (cleanUrl.includes('pinterest.com') || cleanUrl.includes('pin.it')) {
    return 'pinterest';
  }
  if (cleanUrl.includes('reddit.com') || cleanUrl.includes('redd.it')) {
    return 'reddit';
  }
  if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com')) {
    return 'x';
  }
  
  return 'website';
};

export const getPlatformConfig = (platform: Platform) => {
  switch (platform) {
    case 'youtube':
      return {
        label: 'YouTube',
        icon: Youtube,
        color: 'text-red-500 bg-red-500/10 border-red-500/20',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        textColor: 'text-red-400',
      };
    case 'instagram':
      return {
        label: 'Instagram',
        icon: Instagram,
        color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/20',
        textColor: 'text-pink-400',
      };
    case 'pinterest':
      return {
        label: 'Pinterest',
        icon: Pin,
        color: 'text-red-600 bg-red-600/10 border-red-600/20',
        bgColor: 'bg-red-600/10',
        borderColor: 'border-red-600/20',
        textColor: 'text-red-500',
      };
    case 'reddit':
      return {
        label: 'Reddit',
        icon: MessageCircle,
        color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        textColor: 'text-orange-400',
      };
    case 'x':
      return {
        label: 'X / Twitter',
        icon: Twitter,
        color: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
        bgColor: 'bg-sky-400/10',
        borderColor: 'border-sky-400/20',
        textColor: 'text-sky-400',
      };
    case 'website':
    default:
      return {
        label: 'Website',
        icon: Globe,
        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        bgColor: 'bg-emerald-400/10',
        borderColor: 'border-emerald-400/20',
        textColor: 'text-emerald-400',
      };
  }
};
