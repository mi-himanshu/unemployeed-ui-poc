import React from 'react';
import { Milestone } from '@/types/milestone';

interface Props {
  phaseTitle: string;
  milestones: Milestone[];
}

const PhaseSection: React.FC<Props> = ({ phaseTitle, milestones }) => (
  <section className="my-12 px-6">
    <h2 className="text-2xl font-bold text-teal mb-6">{phaseTitle}</h2>
    <div className="grid md:grid-cols-3 gap-6">
      {milestones.map((m, idx) => (
        <div
          key={idx}
          className={`border rounded-lg p-4 shadow-sm transition hover:shadow-lg ${
            m.status === 'Completed'
              ? 'bg-tan text-charcoal'
              : m.status === 'Continue'
              ? 'bg-white border-teal'
              : 'bg-white border-red'
          }`}
        >
          <h3 className="text-lg font-semibold mb-2">{m.title}</h3>
          <p className="text-sm mb-2">{m.description}</p>
          <p className="text-xs italic mb-2 text-gray-600">{m.whyItMatters}</p>
          <div className="flex justify-between items-center text-xs mt-4">
            <span className="font-medium">{m.duration}</span>
            <button className="px-3 py-1 rounded bg-teal text-white text-xs hover:bg-teal-dark">
              {m.status === 'Completed' ? 'Review' : m.status}
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default PhaseSection;