import React from 'react';
import { ChatBot } from './components/ChatBot';
import { BlogSection } from './components/BlogSection';
import { Briefcase, Code, Brain, BookOpen } from 'lucide-react';
import HeroSection from './components/HeroSection';
import TimelineDemo from './components/TimelineDemo';
import { AnimatedTestimonials } from './components/ui/AnimatedTestimonials';
import { ProjectCard } from './components/ProjectCard';

function App() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Blog Button */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => scrollToSection('blog')}
          className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Blog"
        >
          <BookOpen size={20} className="text-gray-700" />
          <span className="font-medium text-gray-700">Blog</span>
        </button>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-white">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] mb-6">About Me</h2>
              <div className="space-y-4 text-[#424245]">
                <p className="leading-relaxed text-justify">
                I’m a data science and machine learning enthusiast with a strong foundation in engineering and problem-solving. With two years of experience as a Machine Learning Engineer at Quantiphi, I’ve honed my ability to develop data-driven solutions, manage projects independently, and communicate effectively with clients. My work has earned me accolades, including the Unsung Hero Award for reliability and the Dynamo Award for proactive contributions.
                </p>
                <p className="leading-relaxed text-justify">
                I thrive on tackling complex challenges—whether it’s optimizing algorithms, deriving insights from data, or refining machine learning models for scalability. My goal is to bridge the gap between data, technology, and decision-making—driving innovation that creates tangible impact.                </p>
                <p className="leading-relaxed text-justify">
                Beyond my professional work, I enjoy exploring emerging technologies, optimizing systems, and engaging in collaborative learning experiences. I believe in continuous growth, curiosity, and leveraging data to shape the future.
                </p>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => scrollToSection('blog')}
                  className="rounded-full px-6 py-5 border border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3]/5 font-medium"
                >
                  Get in Touch
                </button>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <AnimatedTestimonials 
                images={[
                  "/images/about me/Aditya Kamath 1.webp",
                  "/images/about me/Aditya Kamath 2.webp",
                  "/images/about me/Aditya Kamath 3.webp",
                  "/images/about me/Aditya Kamath 5.webp"]}
                autoplayInterval={4000}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section - Work Experience */}
      <div id="experience">
        <TimelineDemo />
      </div>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 md:py-32 bg-[#f5f5f7]">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] text-center mb-16">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <ProjectCard
              title="Analyzing Citi Bike Ridership Trends: A Comparative Study"
              shortInfo = 'Exploratory Data Analysis (EDA) of Citi Bike ridership data from October 2019 and 2020 to uncover usage patterns, demographic trends, and the impact of the pandemic.'
              description=""
              detailedDescription={`
<h2><strong>Data Overview</strong>:</h2>
<ul>
  <li>The dataset includes details like trip duration, start and stop times, station locations, user type (subscriber vs. customer), gender, and birth year.</li>
  <li>Approximately 50,000 samples were selected from each year for comparison.</li>
</ul>
<br></br>
<h2><strong>Key Analysis & Findings</strong>:</h2>
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
</ul>`}
              image="/images/projects/citibike eda.webp?height=600&width=800"
              tags={["Python", "Pandas", "Tableau"]}
              links={[{
                url: "https://drive.google.com/file/d/16u11aQNWEWpkzT1U8QTtn9reE4OZ79eR/view?usp=sharing",
                label: "View Project",
                icon: "other"
              }]}
              isRichText={true}
            />
            <ProjectCard
              title="Model Selector"
              shortInfo = "Select optimal models for your AI needs. A web platform intelligently recommends cost-effective machine learning models based on your specific tasks to reduce computational expenses."
              
              detailedDescription={`<li><strong>Project:</strong> Intelligent Model Selection Platform for Cost Optimization</li>
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
<li><strong>Outcome:</strong> Facilitates efficient and budget-conscious model selection for diverse applications.</li>`}
              
              description="Select optimal models for your AI needs. A web platform intelligently recommends cost-effective machine learning models based on your specific tasks to reduce computational expenses."
              image="/images/projects/MODEL SELECTOR.webp"
              tags={["Python","GCP CLoud Run","Looker Studio"]}
              links={[{
                url: "https://modelselection.kamathaditya.com/",
                label: "Project",
                icon: "other"
              },
              {
                url: "https://lookerstudio.google.com/reporting/1e18bdd4-5e4f-4f89-b72d-93f551b934d7",
                label: "Dashboard",
                icon: "other"
              },
              {
                url: "https://github.com/iamadityakamath/ModelSelector-Backend",
                label: "Code",
                icon: "other"
              },
            ]}
              isRichText={true}
            />
            <ProjectCard
              title="AI Content Generator"
              description="An AI-powered content generation tool that helps creators produce high-quality content."
              image="/placeholder.svg?height=600&width=800"
              tags={["Python", "TensorFlow", "Next.js"]}
              link="#"
            />
            <ProjectCard
              title="Health & Fitness Tracker"
              description="A comprehensive health and fitness tracking application with personalized insights."
              image="/placeholder.svg?height=600&width=800"
              tags={["React", "Node.js", "MongoDB"]}
              link="#"
            />
            <ProjectCard
              title="Smart Home Dashboard"
              description="A centralized dashboard for controlling and monitoring smart home devices."
              image="/placeholder.svg?height=600&width=800"
              tags={["Vue.js", "Express", "WebSockets"]}
              link="#"
            />
            <ProjectCard
              title="Travel Planning App"
              description="An all-in-one travel planning application with itinerary management and recommendations."
              image="/placeholder.svg?height=600&width=800"
              tags={["React", "GraphQL", "Mapbox"]}
              link="#"
            />
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <div className="container mx-auto px-4 py-8 pb-24">
        <section id="blog" className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Blog</h2>
          <BlogSection />
        </section>
      </div>

      {/* Floating Navigation Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-full shadow-lg p-1">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => scrollToSection('about')}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="About"
          >
            <Brain size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => scrollToSection('experience')}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Experience"
          >
            <Briefcase size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => scrollToSection('portfolio')}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Portfolio"
          >
            <Code size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => scrollToSection('blog')}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Blog"
          >
            <BookOpen size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* ChatBot component */}
      <ChatBot />
    </div>
  );
}

export default App;