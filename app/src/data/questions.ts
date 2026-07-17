import type { AssessmentQuestion } from '@/types/game';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    text: 'A village is being attacked by bandits. What do you do?',
    category: 'aggression',
    options: [
      { text: 'Charge in and fight them head-on!', values: { aggression: 8, courage: 7, honor: 4 } },
      { text: 'Find a strategic position and pick them off.', values: { cunning: 7, perception: 5, aggression: 3 } },
      { text: 'Try to negotiate and find a peaceful solution.', values: { empathy: 8, charisma: 5, honor: 4 } },
      { text: 'Sneak in and rescue the villagers first.', values: { empathy: 6, cunning: 6, independence: 4 } },
    ],
  },
  {
    id: 'q2',
    text: 'You find a mysterious ancient tome in a dungeon. What do you do?',
    category: 'curiosity',
    options: [
      { text: 'Open it immediately! Knowledge is power.', values: { curiosity: 10, intelligence: 3, chaos: 4 } },
      { text: 'Study it carefully before deciding.', values: { curiosity: 6, order: 5, wisdom: 4 } },
      { text: 'Take it to a scholar for identification.', values: { order: 6, wisdom: 4, empathy: 2 } },
      { text: 'Destroy it. Some secrets are too dangerous.', values: { order: 8, spirituality: 4, aggression: 3 } },
    ],
  },
  {
    id: 'q3',
    text: 'A companion betrays your trust. How do you respond?',
    category: 'empathy',
    options: [
      { text: 'Try to understand their reasons and forgive.', values: { empathy: 10, charisma: 4, spirituality: 3 } },
      { text: 'Cut ties immediately. Trust is everything.', values: { order: 8, honor: 6, empathy: -3 } },
      { text: 'Seek revenge. Betrayal demands payment.', values: { aggression: 8, chaos: 5, honor: -4 } },
      { text: 'Use this knowledge to manipulate them later.', values: { cunning: 8, chaos: 4, empathy: -5 } },
    ],
  },
  {
    id: 'q4',
    text: 'What drives you to adventure?',
    category: 'curiosity',
    options: [
      { text: 'The thrill of discovery and new experiences.', values: { curiosity: 10, chaos: 4, independence: 5 } },
      { text: 'The desire to help others and do good.', values: { empathy: 8, honor: 6, spirituality: 4 } },
      { text: 'The pursuit of power and wealth.', values: { aggression: 5, cunning: 5, independence: 4 } },
      { text: 'Following a divine calling or prophecy.', values: { spirituality: 10, order: 5, honor: 4 } },
    ],
  },
  {
    id: 'q5',
    text: 'In a group crisis, what role do you naturally take?',
    category: 'mbti_ei',
    options: [
      { text: 'I take charge and direct everyone.', values: { aggression: 5, honor: 4, order: 4 }, mbtiDimension: 'ei', mbtiValue: 8 },
      { text: 'I support and comfort those who are struggling.', values: { empathy: 8, charisma: 4, spirituality: 3 }, mbtiDimension: 'ei', mbtiValue: 6 },
      { text: 'I analyze the situation and suggest solutions.', values: { curiosity: 5, order: 5, wisdom: 4 }, mbtiDimension: 'ei', mbtiValue: -4 },
      { text: 'I watch and wait for the right moment to act.', values: { cunning: 5, perception: 5, independence: 4 }, mbtiDimension: 'ei', mbtiValue: -8 },
    ],
  },
  {
    id: 'q6',
    text: 'When facing a powerful enemy, what\'s your approach?',
    category: 'aggression',
    options: [
      { text: 'Direct confrontation with full force.', values: { aggression: 10, courage: 8, honor: 4 } },
      { text: 'Study their weaknesses and exploit them.', values: { cunning: 8, perception: 5, wisdom: 3 } },
      { text: 'Seek allies and prepare a strategy.', values: { order: 6, wisdom: 5, charisma: 3 } },
      { text: 'Avoid conflict and find another way.', values: { empathy: 5, cunning: 5, courage: -3 } },
    ],
  },
  {
    id: 'q7',
    text: 'How do you view rules and laws?',
    category: 'order',
    options: [
      { text: 'They are essential for a just society.', values: { order: 10, honor: 6, empathy: 3 } },
      { text: 'They are guidelines, not absolute.', values: { order: 3, curiosity: 5, independence: 5 } },
      { text: 'They are tools of the powerful to control others.', values: { chaos: 8, cunning: 4, independence: 5 } },
      { text: 'I follow my own moral code above all.', values: { honor: 8, spirituality: 5, order: -3 } },
    ],
  },
  {
    id: 'q8',
    text: 'You discover a hidden treasure that could save a dying kingdom. What do you do?',
    category: 'honor',
    options: [
      { text: 'Give it to the kingdom without hesitation.', values: { honor: 10, empathy: 6, order: 4 } },
      { text: 'Use it to gain power and influence.', values: { cunning: 8, charisma: 5, aggression: 3 } },
      { text: 'Keep it hidden until you know who to trust.', values: { cunning: 6, order: 3, wisdom: 4 } },
      { text: 'Share it equally among the people.', values: { empathy: 8, chaos: 4, honor: 3 } },
    ],
  },
  {
    id: 'q9',
    text: 'How do you prefer to solve problems?',
    category: 'mbti_sn',
    options: [
      { text: 'Trust my instincts and gut feelings.', values: { spirituality: 5, courage: 4, chaos: 3 }, mbtiDimension: 'sn', mbtiValue: -8 },
      { text: 'Gather all facts before deciding.', values: { order: 5, perception: 5, wisdom: 3 }, mbtiDimension: 'sn', mbtiValue: 8 },
      { text: 'Look for creative, unconventional solutions.', values: { curiosity: 6, chaos: 5, intelligence: 3 }, mbtiDimension: 'sn', mbtiValue: -4 },
      { text: 'Consult with trusted friends or mentors.', values: { empathy: 5, wisdom: 4, charisma: 3 }, mbtiDimension: 'sn', mbtiValue: 4 },
    ],
  },
  {
    id: 'q10',
    text: 'What kind of legacy do you want to leave?',
    category: 'spirituality',
    options: [
      { text: 'A hero who saved the world.', values: { honor: 8, empathy: 6, courage: 5 } },
      { text: 'A wise ruler who brought peace.', values: { wisdom: 8, order: 6, charisma: 4 } },
      { text: 'A free spirit who lived by their own rules.', values: { chaos: 8, independence: 6, curiosity: 4 } },
      { text: 'A mysterious legend whispered for ages.', values: { cunning: 6, spirituality: 5, independence: 4 } },
    ],
  },
  {
    id: 'q11',
    text: 'A dragon offers you power in exchange for service. Your response?',
    category: 'honor',
    options: [
      { text: 'Refuse. I serve no master.', values: { independence: 10, honor: 6, courage: 5 } },
      { text: 'Accept. Power serves those who wield it.', values: { cunning: 6, aggression: 4, charisma: 3 } },
      { text: 'Negotiate better terms.', values: { charisma: 8, cunning: 5, order: 3 } },
      { text: 'Destroy the dragon. Evil must be stopped.', values: { aggression: 8, honor: 6, courage: 5 } },
    ],
  },
  {
    id: 'q12',
    text: 'How do you feel about working with others?',
    category: 'mbti_ei',
    options: [
      { text: 'I thrive in teams and love collaboration.', values: { empathy: 6, charisma: 5, honor: 3 }, mbtiDimension: 'ei', mbtiValue: 10 },
      { text: 'I work with others when necessary.', values: { order: 4, wisdom: 3, empathy: 2 }, mbtiDimension: 'ei', mbtiValue: 2 },
      { text: 'I prefer small, trusted circles.', values: { cunning: 4, empathy: 3, independence: 3 }, mbtiDimension: 'ei', mbtiValue: -4 },
      { text: 'I work best alone.', values: { independence: 8, cunning: 4, perception: 3 }, mbtiDimension: 'ei', mbtiValue: -10 },
    ],
  },
  {
    id: 'q13',
    text: 'You encounter a wounded enemy. What do you do?',
    category: 'empathy',
    options: [
      { text: 'Help them. Mercy defines us.', values: { empathy: 10, honor: 5, spirituality: 4 } },
      { text: 'End their suffering quickly.', values: { honor: 4, aggression: 5, empathy: 2 } },
      { text: 'Leave them. Their fate is their own.', values: { independence: 6, order: 2, empathy: -2 } },
      { text: 'Interrogate them for information first.', values: { cunning: 8, order: 3, aggression: 3 } },
    ],
  },
  {
    id: 'q14',
    text: 'What is your relationship with fate and destiny?',
    category: 'spirituality',
    options: [
      { text: 'I forge my own destiny.', values: { independence: 10, courage: 5, chaos: 4 } },
      { text: 'I follow the path laid before me.', values: { order: 8, spirituality: 6, honor: 4 } },
      { text: 'I seek to understand fate\'s design.', values: { curiosity: 6, wisdom: 5, spirituality: 5 } },
      { text: 'I manipulate fate to my advantage.', values: { cunning: 8, chaos: 5, intelligence: 3 } },
    ],
  },
  {
    id: 'q15',
    text: 'When making important decisions, what guides you most?',
    category: 'mbti_tf',
    options: [
      { text: 'Logic and rational analysis.', values: { intelligence: 5, order: 4, wisdom: 3 }, mbtiDimension: 'tf', mbtiValue: -10 },
      { text: 'My feelings and moral compass.', values: { empathy: 6, spirituality: 4, honor: 4 }, mbtiDimension: 'tf', mbtiValue: 10 },
      { text: 'What benefits me and my goals.', values: { cunning: 6, independence: 4, aggression: 3 }, mbtiDimension: 'tf', mbtiValue: -4 },
      { text: 'What helps the most people.', values: { empathy: 8, honor: 5, charisma: 3 }, mbtiDimension: 'tf', mbtiValue: 8 },
    ],
  },
  {
    id: 'q16',
    text: 'You have a day of peace in a beautiful forest. How do you spend it?',
    category: 'curiosity',
    options: [
      { text: 'Explore and discover hidden places.', values: { curiosity: 8, agility: 3, perception: 4 } },
      { text: 'Meditate and connect with nature.', values: { spirituality: 8, wisdom: 4, vitality: 3 } },
      { text: 'Train and hone my combat skills.', values: { aggression: 6, endurance: 4, strength: 3 } },
      { text: 'Write poetry or songs about the beauty.', values: { charisma: 6, curiosity: 4, empathy: 3 } },
    ],
  },
  {
    id: 'q17',
    text: 'A powerful artifact corrupts those who wield it. What do you do?',
    category: 'order',
    options: [
      { text: 'Destroy it. No power is worth corruption.', values: { honor: 8, order: 6, spirituality: 4 } },
      { text: 'Seal it away where no one can find it.', values: { order: 8, wisdom: 5, cunning: 3 } },
      { text: 'Try to purify it with magic.', values: { curiosity: 6, intelligence: 4, spirituality: 4 } },
      { text: 'Use it briefly for a just cause.', values: { cunning: 6, chaos: 4, courage: 3 } },
    ],
  },
  {
    id: 'q18',
    text: 'How do you handle fear?',
    category: 'courage',
    options: [
      { text: 'Face it head-on. Fear is for the weak.', values: { courage: 10, aggression: 5, honor: 3 } },
      { text: 'Acknowledge it and push through.', values: { courage: 6, wisdom: 4, endurance: 4 } },
      { text: 'Use it to become more cautious and prepared.', values: { wisdom: 6, perception: 4, order: 3 } },
      { text: 'Channel it into clever solutions.', values: { cunning: 6, intelligence: 4, chaos: 3 } },
    ],
  },
  {
    id: 'q19',
    text: 'What is the purpose of strength?',
    category: 'honor',
    options: [
      { text: 'To protect those who cannot protect themselves.', values: { empathy: 8, honor: 8, courage: 4 } },
      { text: 'To achieve greatness and recognition.', values: { charisma: 6, aggression: 4, independence: 4 } },
      { text: 'To enforce justice and order.', values: { order: 8, honor: 6, aggression: 3 } },
      { text: 'To be free from all constraints.', values: { independence: 8, chaos: 5, courage: 3 } },
    ],
  },
  {
    id: 'q20',
    text: 'You have a free evening in a tavern. What do you do?',
    category: 'mbti_jp',
    options: [
      { text: 'Plan the next day\'s adventure meticulously.', values: { order: 8, perception: 4, wisdom: 3 }, mbtiDimension: 'jp', mbtiValue: 10 },
      { text: 'Chat with strangers and make new friends.', values: { charisma: 8, empathy: 4, courage: 3 }, mbtiDimension: 'jp', mbtiValue: -6 },
      { text: 'Listen to stories and rumors.', values: { curiosity: 6, perception: 4, wisdom: 3 }, mbtiDimension: 'jp', mbtiValue: 4 },
      { text: 'See where the night takes you.', values: { chaos: 6, curiosity: 5, independence: 4 }, mbtiDimension: 'jp', mbtiValue: -10 },
    ],
  },
];
