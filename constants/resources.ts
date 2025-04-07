export interface Resource {
    id: string;
    title: string;
    description: string;
    url: string;
    type: 'emergency' | 'support' | 'information';
  }
  
  export const resources: Resource[] = [
    {
      id: '1',
      title: 'National Suicide Prevention Lifeline',
      description: '24/7, free and confidential support for people in distress',
      url: 'https://suicidepreventionlifeline.org/',
      type: 'emergency',
    },
    {
      id: '2',
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741 to connect with a Crisis Counselor',
      url: 'https://www.crisistextline.org/',
      type: 'emergency',
    },
    {
      id: '3',
      title: 'SAMHSA Treatment Locator',
      description: 'Find treatment facilities confidentially and anonymously',
      url: 'https://findtreatment.samhsa.gov/',
      type: 'support',
    },
    {
      id: '4',
      title: 'National Alliance on Mental Illness',
      description: 'Resources and support for individuals and families',
      url: 'https://www.nami.org/',
      type: 'support',
    },
    {
      id: '5',
      title: 'Mental Health America',
      description: 'Tools, screening, and resources to support mental health',
      url: 'https://www.mhanational.org/',
      type: 'information',
    },
    {
      id: '6',
      title: 'Anxiety and Depression Association of America',
      description: 'Information on anxiety, depression, and related disorders',
      url: 'https://adaa.org/',
      type: 'information',
    },
  ];