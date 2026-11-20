export type Publication = {
  id: string;
  title: string;
  venue: string;
  year: number;
  url: string;
};

export const publications: Publication[] = [
  {
    id: 'icmlsc-2026',
    title: 'Comparative Analysis of Neural Network Architectures for EEG Speech Classification',
    venue: 'Machine Learning and Soft Computing (ICMLSC 2026), Communications in Computer and Information Science',
    year: 2026,
    url: 'https://doi.org/10.1007/978-981-92-1546-1_41',
  },
];
