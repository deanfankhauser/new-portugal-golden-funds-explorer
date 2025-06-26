
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Users, Calculator } from 'lucide-react';
import { getAllCategories } from '../../data/services/categories-service';
import { getAllFundManagers } from '../../data/services/managers-service';
import { categoryToSlug, managerToSlug } from '../../lib/utils';

const HomepageInfoSections = () => {
  const categories = getAllCategories().slice(0, 6); // Top 6 categories
  const managers = getAllFundManagers().slice(0, 4); // Top 4 managers

  return (
    <div className="space-y-12">
      {/* Strategic Category Links */}
      <section className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-high-contrast">
            Explore Fund Categories
          </h2>
        </div>
        <p className="text-medium-contrast mb-6 text-lg">
          Discover specialized investment opportunities across different sectors and strategies.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/categories/${categoryToSlug(category)}`}
              className="group p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-high-contrast group-hover:text-primary">
                  {category}
                </span>
                <ArrowRight className="h-4 w-4 text-medium-contrast group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
        >
          View All Categories
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Strategic Manager Links */}
      <section className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-high-contrast">
            Top Fund Managers
          </h2>
        </div>
        <p className="text-medium-contrast mb-6 text-lg">
          Learn about the experienced professionals managing your Golden Visa investments.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {managers.map((manager) => (
            <Link
              key={manager.name}
              to={`/manager/${managerToSlug(manager.name)}`}
              className="group p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-high-contrast group-hover:text-primary block">
                    {manager.name}
                  </span>
                  <span className="text-sm text-medium-contrast">
                    {manager.fundsCount} fund{manager.fundsCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-medium-contrast group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
        <Link
          to="/managers"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
        >
          View All Managers
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Tools and Resources */}
      <section className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-high-contrast">
            Investment Tools
          </h2>
        </div>
        <p className="text-medium-contrast mb-6 text-lg">
          Use our specialized tools to make informed Golden Visa investment decisions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/roi-calculator"
            className="group p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-high-contrast group-hover:text-primary block">
                  ROI Calculator
                </span>
                <span className="text-sm text-medium-contrast">
                  Calculate potential returns
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-medium-contrast group-hover:text-primary transition-colors" />
            </div>
          </Link>
          <Link
            to="/fund-quiz"
            className="group p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-high-contrast group-hover:text-primary block">
                  Fund Recommendation Quiz
                </span>
                <span className="text-sm text-medium-contrast">
                  Find your ideal fund
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-medium-contrast group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-high-contrast">
            Why Choose Our Platform
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">11+</div>
            <div className="text-high-contrast font-medium mb-1">Verified Funds</div>
            <div className="text-sm text-medium-contrast">All funds vetted for Golden Visa eligibility</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">€500M+</div>
            <div className="text-high-contrast font-medium mb-1">Assets Under Management</div>
            <div className="text-sm text-medium-contrast">Representing quality investment opportunities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-high-contrast font-medium mb-1">Transparency</div>
            <div className="text-sm text-medium-contrast">Full fund information and fee disclosure</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomepageInfoSections;
