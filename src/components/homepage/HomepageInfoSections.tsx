
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Users, Calculator, Sparkles } from 'lucide-react';
import { getAllCategories } from '../../data/services/categories-service';
import { getAllFundManagers } from '../../data/services/managers-service';
import { categoryToSlug, managerToSlug } from '../../lib/utils';

const HomepageInfoSections = () => {
  const categories = getAllCategories().slice(0, 6); // Top 6 categories
  const managers = getAllFundManagers().slice(0, 4); // Top 4 managers

  return (
    <div className="spacing-responsive-lg">
      {/* Strategic Category Links */}
      <section className="card-modern p-8 lg:p-10 stagger-animation">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-high-contrast mb-2">
              Explore Fund Categories
            </h2>
            <p className="text-medium-contrast">
              Discover specialized investment opportunities across different sectors
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category, index) => (
            <Link
              key={category}
              to={`/categories/${categoryToSlug(category)}`}
              className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-primary 
                         transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 
                         bg-gradient-to-br from-white to-gray-50 hover:from-primary/5 hover:to-primary/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-high-contrast group-hover:text-primary transition-colors duration-300">
                  {category}
                </span>
                <ArrowRight className="h-5 w-5 text-medium-contrast group-hover:text-primary 
                                     transition-all duration-300 group-hover:translate-x-1" />
              </div>
              <div className="mt-3 text-sm text-medium-contrast group-hover:text-primary/80 transition-colors duration-300">
                Explore funds in this category
              </div>
            </Link>
          ))}
        </div>
        
        <Link
          to="/categories"
          className="inline-flex items-center gap-3 text-primary hover:text-primary/80 font-semibold text-lg
                     transition-all duration-300 hover:translate-x-1 group"
        >
          View All Categories
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Strategic Manager Links */}
      <section className="card-modern p-8 lg:p-10 stagger-animation">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-2xl">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-high-contrast mb-2">
              Top Fund Managers
            </h2>
            <p className="text-medium-contrast">
              Learn about the experienced professionals managing your investments
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {managers.map((manager, index) => (
            <Link
              key={manager.name}
              to={`/manager/${managerToSlug(manager.name)}`}
              className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 
                         transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 
                         bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-high-contrast group-hover:text-blue-600 
                                 transition-colors duration-300 text-lg mb-2">
                    {manager.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-medium-contrast group-hover:text-blue-600/80 transition-colors duration-300">
                      {manager.fundsCount} fund{manager.fundsCount !== 1 ? 's' : ''}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Verified
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-medium-contrast group-hover:text-blue-600 
                                     transition-all duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
        
        <Link
          to="/managers"
          className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-500 font-semibold text-lg
                     transition-all duration-300 hover:translate-x-1 group"
        >
          View All Managers
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Tools and Resources */}
      <section className="card-modern p-8 lg:p-10 stagger-animation">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-2xl">
            <Calculator className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-high-contrast mb-2">
              Investment Tools
            </h2>
            <p className="text-medium-contrast">
              Use our specialized tools to make informed investment decisions
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/roi-calculator"
            className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 
                       transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 
                       bg-gradient-to-br from-white to-gray-50 hover:from-emerald-50 hover:to-emerald-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors duration-300">
                <Calculator className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-high-contrast group-hover:text-emerald-600 
                               transition-colors duration-300 text-lg">
                  ROI Calculator
                </h3>
                <p className="text-sm text-medium-contrast group-hover:text-emerald-600/80 transition-colors duration-300">
                  Calculate potential returns on your investment
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-medium-contrast group-hover:text-emerald-600 
                                   transition-all duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
          
          <Link
            to="/fund-quiz"
            className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-500 
                       transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 
                       bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-purple-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-300">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-high-contrast group-hover:text-purple-600 
                               transition-colors duration-300 text-lg">
                  Fund Recommendation Quiz
                </h3>
                <p className="text-sm text-medium-contrast group-hover:text-purple-600/80 transition-colors duration-300">
                  Find your ideal fund based on your goals
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-medium-contrast group-hover:text-purple-600 
                                   transition-all duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="card-modern p-8 lg:p-10 stagger-animation">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-2xl">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-high-contrast mb-2">
              Why Choose Our Platform
            </h2>
            <p className="text-medium-contrast">
              Trusted by investors worldwide for Golden Visa opportunities
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="text-5xl font-bold text-primary mb-2 transition-all duration-300 group-hover:scale-110">
                11+
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-high-contrast font-semibold text-lg mb-2">Verified Funds</div>
            <div className="text-medium-contrast">
              All funds vetted for Golden Visa eligibility
            </div>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="text-5xl font-bold text-blue-600 mb-2 transition-all duration-300 group-hover:scale-110">
                €500M+
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-2xl 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-high-contrast font-semibold text-lg mb-2">Assets Under Management</div>
            <div className="text-medium-contrast">
              Representing quality investment opportunities
            </div>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="text-5xl font-bold text-emerald-600 mb-2 transition-all duration-300 group-hover:scale-110">
                100%
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-2xl 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-high-contrast font-semibold text-lg mb-2">Transparency</div>
            <div className="text-medium-contrast">
              Full fund information and fee disclosure
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomepageInfoSections;
