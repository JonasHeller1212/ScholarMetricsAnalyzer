import React from 'react';
import { Hash } from 'lucide-react';
import type { Topic } from '../types/scholar';

interface TopicsListProps {
  topics: Topic[];
}

export function TopicsList({ topics = [] }: TopicsListProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic, index) => (
        <a
          key={index}
          href={topic.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs transition-colors"
        >
          <Hash className="h-3 w-3" />
          <span>{topic.name}</span>
          <span className="text-blue-500">({topic.paperCount})</span>
        </a>
      ))}
    </div>
  );
}