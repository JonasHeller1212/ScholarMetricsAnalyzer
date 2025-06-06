import React from 'react';
import { Hash } from 'lucide-react';
import type { Topic } from '../types/scholar';

interface TopicsListProps {
  topics: Topic[];
  compact?: boolean;
}

export function TopicsList({ topics = [], compact = false }: TopicsListProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {topics.map((topic, index) => {
        // Extract the topic name, handling cases where it might be an object
        let topicName = '';
        let paperCount = topic.paperCount;

        if (typeof topic.name === 'object' && topic.name !== null) {
          // If name is an object, use the title property if available
          topicName = topic.name.title || 'Unknown Topic';
        } else {
          // Otherwise use the name directly if it's a primitive value
          topicName = String(topic.name || 'Unknown Topic');
        }

        return (
          <a
            key={index}
            href={topic.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center space-x-1 px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors ${
              compact ? 'text-[10px]' : 'text-xs'
            }`}
            title={`${topicName} (${paperCount} papers)`}
          >
            <Hash className={compact ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
            <span>{topicName}</span>
            {!compact && <span className="text-blue-500">({paperCount})</span>}
          </a>
        );
      })}
    </div>
  );
}