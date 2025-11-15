import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, ArrowRight, Trash2, CheckCircle, Settings, Search } from 'lucide-react';

/**
 * ButtonShowcase - Visual reference for all button variants
 * This component demonstrates all button variants and sizes in the design system
 */
const ButtonShowcase: React.FC = () => {
  return (
    <div className="space-y-12 p-8 bg-background">
      <div>
        <h2 className="text-2xl font-bold mb-6">Button Variants</h2>
        
        {/* Primary Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Primary (Default)</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Primary Button</Button>
            <Button>
              <Download />
              With Icon
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>

        {/* Secondary Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Secondary</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="secondary">
              Cancel
            </Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
        </div>

        {/* Outline Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Outline</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">Outline Button</Button>
            <Button variant="outline">
              <Settings />
              Settings
            </Button>
            <Button variant="outline" disabled>Disabled</Button>
          </div>
        </div>

        {/* Ghost Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Ghost</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="ghost" size="icon">
              <Search />
            </Button>
            <Button variant="ghost" disabled>Disabled</Button>
          </div>
        </div>

        {/* Link Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Link</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="link">Link Button</Button>
            <Button variant="link">
              Learn More
              <ArrowRight />
            </Button>
          </div>
        </div>

        {/* Accent Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Accent (Bronze)</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="accent">Accent Button</Button>
            <Button variant="accent">
              <ArrowRight />
              Special Action
            </Button>
            <Button variant="accent" disabled>Disabled</Button>
          </div>
        </div>

        {/* Success Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Success</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="success">Success Button</Button>
            <Button variant="success">
              <CheckCircle />
              Approved
            </Button>
            <Button variant="success" disabled>Disabled</Button>
          </div>
        </div>

        {/* Destructive Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Destructive</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="destructive">Delete</Button>
            <Button variant="destructive">
              <Trash2 />
              Remove
            </Button>
            <Button variant="destructive" disabled>Disabled</Button>
          </div>
        </div>
      </div>

      {/* Button Sizes */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="icon" variant="outline">
            <Settings />
          </Button>
        </div>
      </div>

      {/* Common Patterns */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Common Patterns</h2>
        
        {/* Form Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Form Actions</h3>
          <div className="flex gap-3 justify-end">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* Hero Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Hero Actions</h3>
          <div className="flex gap-4">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Card Actions</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">Compare</Button>
            <Button size="sm" className="flex-1">View Details</Button>
          </div>
        </div>

        {/* Full Width */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Full Width</h3>
          <Button className="w-full">Submit Application</Button>
        </div>

        {/* Destructive Confirmation */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Destructive Action</h3>
          <div className="flex gap-3 justify-end">
            <Button variant="outline">Keep Account</Button>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;
