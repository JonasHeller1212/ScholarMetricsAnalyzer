import React from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Presentation as Citation, 
  Percent, 
  Award, 
  Network, 
  Zap, 
  BarChart, 
  User,
  UserPlus,
  UsersRound,
  Clock
} from 'lucide-react';
import { Tooltip } from './Tooltip';
import { metricInfo } from '../data/metricInfo';

interface MetricsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: 'citations' | 'hIndex' | 'gIndex' | 'publications' | 'i10Index' | 'scr' | 'hpIndex' | 
        'sIndex' | 'rcr' | 'pubsPerYear' | 'network' | 'coAuthors' | 'avgAuthors' | 'soloAuthor' | 
        'h5Index' | 'acc5' | 'citationsPerYear';
}

export function MetricsCard({ title, value, subtitle, icon }: MetricsCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'citations': return <Citation className="h-3.5 w-3.5" />;
      case 'citationsPerYear': return <Clock className="h-3.5 w-3.5" />;
      case 'hIndex': return <TrendingUp className="h-3.5 w-3.5" />;
      case 'gIndex': return <BarChart className="h-3.5 w-3.5" />;
      case 'publications': return <BookOpen className="h-3.5 w-3.5" />;
      case 'i10Index': return <Award className="h-3.5 w-3.5" />;
      case 'scr': return <Percent className="h-3.5 w-3.5" />;
      case 'hpIndex': return <Award className="h-3.5 w-3.5" />;
      case 'sIndex': return <Network className="h-3.5 w-3.5" />;
      case 'rcr': return <Zap className="h-3.5 w-3.5" />;
      case 'pubsPerYear': return <BookOpen className="h-3.5 w-3.5" />;
      case 'network': return <Network className="h-3.5 w-3.5" />;
      case 'coAuthors': return <Users className="h-3.5 w-3.5" />;
      case 'avgAuthors': return <UsersRound className="h-3.5 w-3.5" />;
      case 'soloAuthor': return <User className="h-3.5 w-3.5" />;
      case 'h5Index': return <TrendingUp className="h-3.5 w-3.5" />;
      case 'acc5': return <UserPlus className="h-3.5 w-3.5" />;
      default: return <Citation className="h-3.5 w-3.5" />;
    }
  };

  const getMetricKey = () => {
    switch (icon) {
      case 'citations': return 'citations';
      case 'citationsPerYear': return 'citationsPerYear';
      case 'hIndex': return 'hIndex';
      case 'gIndex': return 'gIndex';
      case 'publications': return 'publications';
      case 'i10Index': return 'i10Index';
      case 'scr': return 'selfCitationRate';
      case 'hpIndex': return 'hpIndex';
      case 'sIndex': return 'sIndex';
      case 'rcr': return 'rcr';
      case 'pubsPerYear': return 'pubsPerYear';
      case 'network': return 'collaborationScore';
      case 'coAuthors': return 'coAuthors';
      case 'avgAuthors': return 'averageAuthors';
      case 'soloAuthor': return 'soloAuthor';
      case 'h5Index': return 'h5Index';
      case 'acc5': return 'acc5';
      default: return 'citations';
    }
  };

  const tooltipInfo = metricInfo[getMetricKey()];

  if (!tooltipInfo) {
    console.warn(`No tooltip info found for metric: ${getMetricKey()}`);
    return (
      <div className="bg-white/80 backdrop-blur-lg p-3 rounded-lg shadow-sm border border-gray-100/50 w-full">
        <div className="flex items-start space-x-2">
          <div className="p-1.5 bg-gradient-to-br from-primary-start to-primary-end rounded-md text-white mt-0.5">
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 leading-none">{title}</p>
            <p className="text-sm font-semibold gradient-text mt-1 truncate">{value}</p>
            {subtitle && (
              <p className="text-[10px] text-gray-500 leading-tight mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tooltip content={tooltipInfo}>
      <div className="bg-white/80 backdrop-blur-lg p-3 rounded-lg shadow-sm border border-gray-100/50 cursor-help transition-all hover:shadow-md hover:border-primary-start/50 w-full">
        <div className="flex items-start space-x-2">
          <div className="p-1.5 bg-gradient-to-br from-primary-start to-primary-end rounded-md text-white mt-0.5">
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 leading-none">{title}</p>
            <p className="text-sm font-semibold gradient-text mt-1 truncate">{value}</p>
            {subtitle && (
              <p className="text-[10px] text-gray-500 leading-tight mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </Tooltip>
  );
}