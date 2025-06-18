import CompanyInfo from './company-info';
import PlatformLinks from './platform-links';
import SolutionsLinks from './solutions-links';
import ResourcesNewsletter from './resources-newsletter';
import TechnologyPartners from './technology-partners';
import BottomBar from './bottom-bar';
import NetworkStatus from './network-status';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <CompanyInfo />
            <PlatformLinks />
            <SolutionsLinks />
            <ResourcesNewsletter />
          </div>
        </div>

        <TechnologyPartners />
        <BottomBar />
        <NetworkStatus />
      </div>
    </footer>
  );
}
