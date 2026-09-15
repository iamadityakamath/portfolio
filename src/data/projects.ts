export interface ProjectLink {
  url: string;
  label: string;
  icon: 'github' | 'demo' | 'website' | 'other';
}

export interface Project {
  id: string;
  title: string;
  shortInfo: string;
  description: string;
  detailedDescription?: string;
  image: string;
  category: string;
  stats?: string[];
  tags: string[];
  links?: ProjectLink[];
  isRichText?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 'citibike',
    title: 'Analyzing Citi Bike Ridership Trends',
    shortInfo:
      'Exploratory analysis of Citi Bike ridership from October 2019 and 2020, uncovering usage patterns, demographic trends, and the impact of the pandemic.',
    description:
      'Exploratory Data Analysis (EDA) of Citi Bike ridership data from October 2019 and 2020 to uncover usage patterns, demographic trends, and the impact of the pandemic.',
    detailedDescription: `
<h2><strong>Data Overview</strong>:</h2>
<ul>
  <li>The dataset includes details like trip duration, start and stop times, station locations, user type (subscriber vs. customer), gender, and birth year.</li>
  <li>Approximately 50,000 samples were selected from each year for comparison.</li>
</ul>
<br></br>
<h2><strong>Key Analysis &amp; Findings</strong>:</h2>
<ul>
  <li><strong>Ridership Trends</strong>: The number of bikes and stations increased from 2019 to 2020, but overall ridership patterns shifted due to the pandemic.</li>
  <li><strong>Station Popularity</strong>: Grove Street Path remained the busiest station across both years, while other top stations varied.</li>
  <li><strong>User Demographics</strong>: Male users dominated both years, but there was an increase in casual customers and a decrease in annual subscribers in 2020.</li>
  <li><strong>Trip Duration</strong>: Average trip duration increased, possibly due to leisure cycling during the lockdown.</li>
  <li><strong>Peak Hours</strong>: In 2019, peak usage was during commute hours (morning and evening), while in 2020, evening usage became more prominent, reflecting work-from-home trends.</li>
</ul>
<br></br>
<h2><strong>Tools Used:</strong></h2>
<ul>
  <li><strong>Python</strong> (Pandas, Matplotlib, Seaborn, NumPy) for data processing and visualization.</li>
  <li><strong>Tableau</strong> for interactive data visualization.</li>
</ul>
<br></br>
<h2><strong>Key Takeaways:</strong></h2>
<ul>
  <li>EDA helped uncover shifts in user behavior due to external factors like the pandemic.</li>
  <li>Data-driven recommendations include targeting female riders and younger users to grow Citi Bike's subscriber base.</li>
  <li>Potential future scope includes developing a predictive model to optimize bike deployment based on peak usage trends.</li>
</ul>`,
    image: '/images/projects/citibike eda.webp',
    category: 'Data Analytics',
    stats: ['50K samples analyzed', '2019 vs 2020 comparison'],
    tags: ['Python', 'Pandas', 'Tableau'],
    links: [
      {
        url: 'https://drive.google.com/file/d/16u11aQNWEWpkzT1U8QTtn9reE4OZ79eR/view?usp=sharing',
        label: 'View Project',
        icon: 'other',
      },
    ],
    isRichText: true,
  },
  {
    id: 'model-selector',
    title: 'Model Selector',
    shortInfo:
      'A web platform that recommends cost-effective machine learning models for your specific task, reducing computational spend.',
    description:
      'Select optimal models for your AI needs. A web platform intelligently recommends cost-effective machine learning models based on your specific tasks to reduce computational expenses.',
    detailedDescription: `<li><strong>Project:</strong> Intelligent Model Selection Platform for Cost Optimization</li>
<li><strong>Goal:</strong> Empower users to choose the most cost-effective machine learning models for their specific tasks.</li>
<li><strong>Key Features:</strong>
    <ul>
        <li>Task-based model filtering.</li>
        <li>User-defined performance and cost constraints.</li>
        <li>Curated model database with relevant metrics.</li>
        <li>Intelligent model recommendation engine.</li>
        <li>Side-by-side model comparison.</li>
    </ul>
</li>
<li><strong>Value Proposition:</strong> Reduces computational expenses and resource usage in machine learning projects.</li>
<li><strong>Tech Stack:</strong> Flask, GCP- Bigquery, Cloud Run, Looker Studio, Python</li>
<li><strong>Outcome:</strong> Facilitates efficient and budget-conscious model selection for diverse applications.</li>`,
    image: '/images/projects/MODEL SELECTOR.webp',
    category: 'Data Science',
    stats: ['Cost-optimized model picks', 'Live Looker Studio dashboard'],
    tags: ['Python', 'GCP Cloud Run', 'Looker Studio'],
    links: [
      { url: 'https://modelselection.kamathaditya.com/', label: 'Project', icon: 'website' },
      {
        url: 'https://lookerstudio.google.com/reporting/1e18bdd4-5e4f-4f89-b72d-93f551b934d7',
        label: 'Dashboard',
        icon: 'demo',
      },
      {
        url: 'https://github.com/iamadityakamath/ModelSelector-Backend',
        label: 'Code',
        icon: 'github',
      },
    ],
    isRichText: true,
  },
  {
    id: 'ai-content',
    title: 'AI Content Generator',
    shortInfo: 'An AI-powered content generation tool that helps creators produce high-quality content.',
    description: 'An AI-powered content generation tool that helps creators produce high-quality content.',
    image: '/placeholder.svg',
    category: 'Machine Learning',
    tags: ['Python', 'TensorFlow', 'Next.js'],
  },
];

/** Fixed display order for the portfolio filter. */
export const CATEGORIES = ['All', 'Data Science', 'Data Analytics', 'Machine Learning'];
